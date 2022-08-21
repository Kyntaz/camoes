import { StructureMapper } from "./StructureMapper";

export class Variable {
    #name: string;
    #greedy: boolean;
    #guard: (value: string | StructureMapper) => boolean;

    constructor(
        name: string,
        {
            greedy = false,
            guard = (_value: string | StructureMapper) => true as boolean,
        } = {}
    ) {
        this.#name = name;
        this.#greedy = greedy;
        this.#guard = guard;
    }

    get name() {
        return this.#name;
    }

    get greedy() {
        return this.#greedy;
    }

    get guard() {
        return this.#guard;
    }
}
