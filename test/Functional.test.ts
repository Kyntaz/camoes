import { ApplicationError } from "../src/Apply";
import { grammar, invoke, variable } from "../src/Functional";

describe("#Functional", () => {
    describe("when matching static strings", () => {
        it("matches correct inputs", () => {
            const output = { value: "constant" };
            const result = grammar()
                .match("TestMatch", output, ["some static text"])
                .parse("TestMatch", "some static text");
            expect(result).toEqual(output);
        });
        
        it("rejects incorrect inputs", () => {
            const output = { value: "constant" };
            const test = () => grammar()
                .match("TestMatch", output, ["some static text"])
                .parse("TestMatch", "some wrong text");
            expect(test).toThrowError(ApplicationError);
        });

        describe("when the rule is made of multiple strings", () => {
            it("matches correct inputs", () => {
                const output = "constant";
                const result = grammar()
                    .match("TestMatch", output, ["some", " static ", "text"])
                    .parse("TestMatch", "some static text");
                expect(result).toEqual(output);
            });
            
            it("rejects incorrect inputs", () => {
                const output = { value: "constant" };
                const test = () => grammar()
                    .match("TestMatch", output, ["some", " static ", "text"])
                    .parse("TestMatch", "some wrong text");
                expect(test).toThrowError(ApplicationError);
            });
        });
    });

    describe("when matching regular expressions", () => {
        it("matches correct inputs", () => {
            const output = true;
            const result = grammar()
                .match("TestMatch", output, [/ab*a/])
                .parse("TestMatch", "abbbba");
            expect(result).toEqual(output);
        });

        it("rejects incorrect inputs", () => {
            const output = 42;
            const test = () => grammar()
                .match("TestMatch", output, [/ab*a/])
                .parse("TestMatch", "cabbbba");
            expect(test).toThrowError(ApplicationError);
        });

        describe("when the rule has multiple segments", () => {
            it("matches correct inputs", () => {
                const output = { value: "constant" };
                const result = grammar()
                    .match("TestMatch", output, [/\*+/, "star", /\*+/])
                    .parse("TestMatch", "***star**");
                expect(result).toEqual(output);
            });
    
            it("rejects incorrect inputs", () => {
                const output = { value: "constant" };
                const test = () => grammar()
                    .match("TestMatch", output, [/\*+/, "star", /\*+/])
                    .parse("TestMatch", "****star");
                expect(test).toThrowError(ApplicationError);
            });
        });
    });

    describe("when matching variable literals", () => {
        it("assigns the input to the variable", () => {
            const result = grammar()
                .match("TestMatch", { value: variable("X") }, [variable("X")])
                .parse("TestMatch", "Some input");
            expect(result).toEqual({ value: "Some input" });
        });

        it("accepts correct inputs", () => {
            const result = grammar()
                .match("TestMatch", { value: variable("X") }, [variable("X"), ",", variable("X")])
                .parse("TestMatch", "abc,abc");
            expect(result).toEqual({ value: "abc" });
        });

        it("rejects incorrect inputs", () => {
            const test = () => grammar()
                .match("TestMatch", { value: variable("X") }, [variable("X"), ",", variable("X")])
                .parse("TestMatch", "abc,ghf");
            expect(test).toThrow(ApplicationError);
        });

        describe("when the rule has multiple segments", () => {
            it("matches correct inputs", () => {
                const result = grammar()
                    .match("TestMatch", {
                        x: variable("X"),
                        y: variable("Y"),
                        inner: {
                            z: variable("Z"),
                        },
                    }, ["(", variable("X"), ",", variable("Y"), ")", /[\-=]+/, variable("Z")])
                    .parse("TestMatch", "(abc,def)==-=Hello there!");
                expect(result).toEqual({
                    x: "abc",
                    y: "def",
                    inner: {
                        z:  "Hello there!",
                    },
                });
            });

            it("rejects incorrect inputs", () => {
                const test = () => grammar()
                    .match("TestMatch", {
                        x: variable("X"),
                        y: variable("Y"),
                        inner: {
                            z: variable("Z"),
                        },
                    }, ["(", variable("X"), ",", variable("Y"), ")", /[\-=]+/, variable("Z")])
                    .parse("TestMatch", "(abc,def) = Hello there!");
                expect(test).toThrowError(ApplicationError);
            });
        });
    });

    describe("when matching invocations", () => {
        it("matches correct inputs", () => {
            const result = grammar()
                .match("InnerMatch", { value: variable("X") }, ["(", variable("X"), ")"])
                .match("TestMatch", { inner: variable("X") }, [invoke("InnerMatch", "X")])
                .parse("TestMatch", "(read this)");
            expect(result).toEqual({
                inner: {
                    value: "read this",
                },
            });
        });

        it("rejects incorrect inputs", () => {
            const test = () => grammar()
                .match("InnerMatch", { value: variable("X") }, ["(", variable("X"), ")"])
                .match("TestMatch", { inner: variable("X") }, [invoke("InnerMatch", "X")])
                .parse("TestMatch", "(read this)->");
            expect(test).toThrowError(ApplicationError);
        });

        describe("when the rule has multiple segments", () => {
            it("matches correct inputs", () => {
                const result = grammar()
                    .match(
                        "InnerMatch",
                        [variable("X"), variable("Y")],
                        [
                            "(",
                            variable("X", { guard: (value: string) => !value.includes(")")}),
                            ",",
                            variable("Y", { guard: (value: string) => !value.includes(")")}),
                            ")"
                        ]
                    )
                    .match(
                        "TestMatch",
                        { x: variable("X"), y: variable("Y") },
                        ["[", invoke("InnerMatch", "X"), ",", invoke("InnerMatch", "Y"), "]"]
                    )
                    .parse("TestMatch", "[(abc,def),(xyz,uvw)]");
                expect(result).toEqual({
                    x: ["abc", "def"],
                    y: ["xyz", "uvw"],
                });
            });

            it("rejects incorrect inputs", () => {
                const test = () => grammar()
                    .match(
                        "InnerMatch",
                        [variable("X"), variable("Y")],
                        ["(", variable("X"), ",", variable("Y"), ")"]
                    )
                    .match(
                        "TestMatch",
                        { x: variable("X") },
                        ["[", invoke("InnerMatch", "X"), ",", invoke("InnerMatch", "X"), "]"]
                    )
                    .parse("TestMatch", "[(abc,def),(xyz,uvw)]");
                expect(test).toThrowError(ApplicationError);
            });
        });
    });

    describe("when matching ambiguous rules", () => {
        it("matches correct inputs", () => {
            const result = grammar()
                .match("TestMatch", { value: "1" }, ["abc"])
                .match("TestMatch", { value: "2" }, ["def"])
                .match("TestMatch", { value: "3" }, ["(", variable("_"), ")"])
                .parse("TestMatch", "def")
            expect(result).toEqual({ value: "2" });
        });

        it("rejects incorrect inputs", () => {
            const test = () => grammar()
                .match("TestMatch", {}, ["(", variable("_"), ")"])
                .match("TestMatch", {}, ["abc"])
                .match("TestMatch", {}, ["def"])
                .parse("TestMatch", "()")
            expect(test).toThrowError(ApplicationError);
        });
    });

    describe("when matching an empty rule", () => {
        it("matches empty strings", () => {
            const result = grammar()
                .match("TestMatch", null, [])
                .parse("TestMatch", "");
            expect(result).toEqual(null);
        });

        it("rejects non-empty strings", () => {
            const test = () => grammar()
                .match("TestMatch", null, [])
                .parse("TestMatch", "1");
            expect(test).toThrowError(ApplicationError);
        });
    });
});