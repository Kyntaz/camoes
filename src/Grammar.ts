import { Invocation } from "./Invocation";
import { Matcher } from "./Matcher";
import { Rule } from "./Rule";
import { RuleLiteral } from "./RuleLiteral";
import { StructureMapper } from "./StructureMapper";
import { Variable } from "./Variable";

export class Grammar {
    #matchers = new Map<string, Matcher>();

    #getOrMakeMatcher(name: string) {
        let matcher = this.#matchers.get(name);
        if (!matcher) {
            matcher = new Matcher(name);
            this.#matchers.set(name, matcher);
        }
        return matcher;
    }

    match(name: string, mapper: StructureMapper, sequence: RuleLiteral[]) {
        const rule = new Rule(sequence, mapper);
        this.#getOrMakeMatcher(name).addRule(rule);
        return rule;
    }

    invoke(name: string, variable: Variable) {
        return new Invocation(this.#getOrMakeMatcher(name), variable);
    }
}