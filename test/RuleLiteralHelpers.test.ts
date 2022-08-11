import { Invocation } from "../src/Invocation";
import { Matcher } from "../src/Matcher";
import { helpers } from "../src/RuleLiteral";
import { Variable } from "../src/Variable";

describe("#RuleLiteralHelpers", () => {
    describe(".isString", () => {
        it("returns true for strings", () => {
            const literal = "string";
            expect(helpers.isString(literal)).toBe(true);
        });

        it("returns false for non-strings", () => {
            const literal = /regular expression/;
            expect(helpers.isString(literal)).toBe(false);
        });
    });

    describe(".isVariable", () => {
        it("returns true for variables", () => {
            const literal = new Variable("variable");
            expect(helpers.isVariable(literal)).toBe(true);
        });

        it("returns false for non-variables", () => {
            const literal = "string";
            expect(helpers.isVariable(literal)).toBe(false);
        });
    });

    describe(".isInvocation", () => {
        it("returns true for invocations", () => {
            const literal = new Invocation(new Matcher("invocation"), {});
            expect(helpers.isInvocation(literal)).toBe(true);
        });

        it("returns false for non-invocations", () => {
            const literal = new Variable("variable");
            expect(helpers.isInvocation(literal)).toBe(false);
        });
    });

    describe(".isRegExp", () => {
        it("returns true for regular expressions", () => {
            const literal = /regular expression/;
            expect(helpers.isRegExp(literal)).toBe(true);
        });

        it("returns false for non-regular expressions", () => {
            const literal = "string";
            expect(helpers.isRegExp(literal)).toBe(false);
        });
    });
})