import { RuleLiteral } from "./RuleLiteral";

export class Rule {
    #sequence: RuleLiteral[];

    constructor(sequence: RuleLiteral[]) {
        this.#sequence = sequence;
    }

    get sequence() {
        return this.#sequence;
    }
}
