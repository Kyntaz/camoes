import { Variable } from "./Variable";

export type RuleLiteral = string | Variable | RegExp;
export type StructureMapper = {
    [key: string]: string | StructureMapper;
};

export class Rule {
    #structure: StructureMapper;
    #sequence: RuleLiteral[];

    constructor(structure: StructureMapper, sequence: RuleLiteral[]) {
        this.#structure = structure
        this.#sequence = sequence;
    }

    get structure() {
        return this.#structure;
    }

    get sequence() {
        return this.#sequence;
    }
}