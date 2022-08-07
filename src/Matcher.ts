import { Rule } from "./Rule";

export class Matcher {
    #name: string;
    rules: Rule[] = [];

    constructor(name: string) {
        this.#name = name;
    }

    get name() {
        return this.#name;
    }

    addRule(rule: Rule) {
        this.rules.push(rule);
    }
}