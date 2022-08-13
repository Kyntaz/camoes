import { applyLiterals, getErrorAndLog } from "./Apply";
import { RuleLiteral } from "./RuleLiteral";
import { StructureMapper } from "./StructureMapper";
import { Variable } from "./Variable";
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
        const result = Rule.#replaceVariables(this.mapper, variableMap);
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

    static #replaceVariables(value: StructureMapper, variableMap: VariableMap): StructureMapper {
        if (value instanceof Variable) {
            return variableMap.get(value.name);
        } else if (Array.isArray(value)) {
            return Rule.#applyVariablesToList(value, variableMap);
        } else if (typeof value === "object") {
            return Rule.#applyVariablesToObject(value, variableMap);
        }  else {
            return value;
        }
    }

    static #applyVariablesToObject(object: { [key: string]: StructureMapper }, variableMap: VariableMap): StructureMapper {
        return Object.keys(object).reduce<StructureMapper>((structure, key) => ({
            ...structure,
            [key]: Rule.#replaceVariables(object[key], variableMap),
        }), {});
    }

    static #applyVariablesToList(list: StructureMapper[], variableMap: VariableMap): StructureMapper {
        return list.map((value) => Rule.#replaceVariables(value, variableMap));
    }
}
