import { Matcher } from "./Matcher";
import { StructureMapper } from "./StructureMapper";

export class Invocation {
    #matcher: Matcher;
    #mapper: StructureMapper;

    constructor(matcher: Matcher, mapper: StructureMapper) {
        this.#matcher = matcher;
        this.#mapper = mapper;
    }

    get matcher() {
        return this.#matcher;
    }

    get mapper() {
        return this.#mapper;
    }
}