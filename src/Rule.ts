import { applyLiterals, getErrorAndLog } from "./Apply";
import { RuleLiteral } from "./RuleLiteral";
import { StructureMapper } from "./StructureMapper";
import { makeEmptyVariableMap, VariableMap } from "./VariableMap";

export class Rule {
    #sequence: RuleLiteral[];
    #mapper: StructureMapper;

    constructor(sequence: RuleLiteral[], mapper: StructureMapper) {
        this.#sequence = sequence;
        this.#mapper = mapper;
    }

    get sequence() {
        return this.#sequence;
    }

    get mapper() {
        return this.#mapper;
    }

    applyPartial(text: string) {
        const variableMap = makeEmptyVariableMap();
        const remainingText = applyLiterals(this.sequence, text, variableMap);
        const result = Rule.#applyVariables(this.mapper, variableMap);
        return {
            remainingText,
            result,
        };
    }

    apply(text: string) {
        const { remainingText, result } = this.applyPartial(text);
        if (remainingText !== "") {
            throw getErrorAndLog(`Could not apply rule: "${remainingText}" was not consumed from the input.`);
        }
        return result;
    }

    static #replaceVariable(value: string | StructureMapper, variableMap: VariableMap) {
        if (typeof value === "string") {
            if (value.startsWith("$")) {
                return variableMap.get(value.slice(1)) ?? "";
            } else {
                return value;
            }
        } else if (typeof value === "object") {
            return Rule.#applyVariables(value, variableMap);
        } else {
            throw new Error("Invalid mapper.");
        }
    }

    static #applyVariables(mapper: StructureMapper, variableMap: VariableMap): StructureMapper {
        return Object.keys(mapper).reduce<StructureMapper>((structure, key) => ({
            ...structure,
            [key]: Rule.#replaceVariable(mapper[key], variableMap),
        }), {});
    }
}
