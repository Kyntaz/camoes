import { Matcher } from "./Matcher";
import { Rule, RuleLiteral, StructureMapper } from "./Rule";
import { Variable } from "./Variable";

export class Grammar {
    matchers = new Map<string, Matcher>();
    variables = new Map<string, Variable>();

    match(name: string, structure: StructureMapper, sequence: RuleLiteral[]) {
        let matcher = this.matchers.get(name);
        if (!matcher) {
            matcher = new Matcher(name);
            this.matchers.set(name, matcher);
        }

        matcher.addRule(new Rule(structure, sequence));
    }

    v(name: string) {
        let variable = this.variables.get(name);
        if (!variable) {
            variable = new Variable(name);
            this.variables.set(name, variable);
        }
        return variable;
    }
}