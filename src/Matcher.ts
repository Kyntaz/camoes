import { ApplicationError } from "./Apply";
import { Rule } from "./Rule";

export class Matcher {
    #name: string;
    #rules: Rule[] = [];

    constructor(name: string) {
        this.#name = name;
    }

    get name() {
        return this.#name;
    }

    get rules() {
        return this.#rules;
    }

    addRule(rule: Rule) {
        this.rules.push(rule);
    }

    applyPartial(text: string) {
        for (const rule of this.rules) {
            try {
                return rule.applyPartial(text);
            } catch (e) {
                if (!(e instanceof ApplicationError)) {
                    throw e;
                }
            }
        }
        throw new ApplicationError();
    }

    apply(text: string) {
        const { remainingText, result } = this.applyPartial(text);
        if (remainingText !== "") {
            throw new ApplicationError();
        }
        return result;
    }
}
