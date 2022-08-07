export class Variable {
    #name: string;
    value: string | null = null;

    constructor(name: string) {
        this.#name = name;
    }

    get name() {
        return this.#name;
    }
}
