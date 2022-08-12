import { ApplicationError } from "../src/Apply";
import { grammar } from "../src/Functional";

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
                const output = { value: "constant" };
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
            const output = { value: "constant" };
            const result = grammar()
                .match("TestMatch", output, [/ab*a/])
                .parse("TestMatch", "abbbba");
            expect(result).toEqual(output);
        });

        it("rejects incorrect inputs", () => {
            const output = { value: "constant" };
            const test = () => grammar()
                .match("TestMatch", output, [/ab*a/])
                .parse("TestMatch", "cabbbba");
            expect(test).toThrowError(ApplicationError);
        });
    });
});