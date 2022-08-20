import { StructureMapper } from "./StructureMapper";

export class Variable {
    #name: string;
    #guard: (value: string | StructureMapper) => boolean;

    constructor(
        name: string,
        {
            guard = (_value: string | StructureMapper) => true as boolean,
        } = {}
    ) {
        this.#name = name;
        this.#guard = guard;
    }

    get name() {
        return this.#name;
    }

    get guard() {
        return this.#guard;
    }
}
