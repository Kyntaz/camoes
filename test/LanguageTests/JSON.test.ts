import { grammar, invoke, variable } from "../../src/Functional";
import { Logger } from "../../src/Logger";

// TODO: variable guards so that we can do numbers.
const whitespace = /\s*/;
const lineBreak = /[\s\r\n]*/;
const jsonGrammar = grammar()
    .match("Terminal", true, ["true"])
    .match("Terminal", false, ["false"])
    .match("Terminal", variable("X"), [invoke("String", "X")])
    .match("String", variable("X"), ["\"", variable("X"), "\""])
    .match(
        "Attribute",
        { key: variable("Key"), value: variable("Value") },
        [invoke("String", "Key"), whitespace, ":", whitespace, invoke("Json", "Value")]
    )
    .match(
        "Attributes",
        { head: variable("H"), tail: variable("T") },
        [invoke("Attribute", "H"), whitespace, ",", lineBreak, invoke("Attributes", "T")],
        {
            transformation: (result) => [...result.tail, result.head],
        }
    )
    .match("Attributes", [variable("X")], [invoke("Attribute", "X"), lineBreak])
    .match("Attributes", [], [])
    .match(
        "Object",
        variable("Inner"),
        ["{", lineBreak, invoke("Attributes", "Inner"), lineBreak, "}"],
        {
            transformation: (result: any[]) => result.reduce((acc, curr) => ({
                ...acc,
                [curr.key]: curr.value,
            }), {}),
        }
    )
    .match(
        "Sequence",
        { head: variable("H"), tail: variable("T") },
        [invoke("Json", "H"), whitespace, ",", lineBreak, invoke("Sequence", "Y")],
        {
            transformation: (result) => [...result.tail, result.head],
        }
    )
    .match("Sequence", [variable("X")], [invoke("Json", "X")])
    .match("Sequence", [], [])
    .match("List", variable("X"), ["[", lineBreak, invoke("Sequence", "X"), lineBreak, "]"])
    .match("Json", variable("X"), [invoke("Terminal", "X")])
    .match("Json", variable("X"), [invoke("Object", "X")])
    .match("Json", variable("X"), [invoke("List", "X")])

describe("#JSON Grammar", () => {
    it("parses some basic json", () => {
        Logger.enabled = true;
        const value = {
            x: "x",
            y: "y",
            z: ["xyz"],
        };
        expect(jsonGrammar.parse("Json", JSON.stringify(value))).toEqual(value);
    });
});
