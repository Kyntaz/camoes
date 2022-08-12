import { ApplicationError, getErrorAndLog } from "./Apply";
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
        throw getErrorAndLog(`Could not partially apply matcher ${this.name}.`);
    }

    apply(text: string) {
        const { remainingText, result } = this.applyPartial(text);
        if (remainingText !== "") {
            throw getErrorAndLog(`Could not apply matcher: "${remainingText}" was not consumed when parting ${this.name}.`);
        }
        return result;
    }
}
