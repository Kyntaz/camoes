import { Matcher } from "./Matcher";
import { Variable } from "./Variable";

export class Invocation {
    #matcher: Matcher;
    #variable: Variable;

    constructor(matcher: Matcher, variable: Variable) {
        this.#matcher = matcher;
        this.#variable = variable;
    }

    get matcher() {
        return this.#matcher;
    }

    get variable() {
        return this.#variable;
    }
}
