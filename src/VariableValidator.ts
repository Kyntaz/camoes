import { StructureMapper } from "./StructureMapper";
import { VariableMap } from "./VariableMap";

export type VariableValidator = { [key: string]: (value: StructureMapper) => boolean };

export const validateVariables = (validator: VariableValidator, variableMap: VariableMap) => {
    for (const variable of Object.keys(validator)) {
        if (!validator[variable](variableMap.get(variable))) {
            return false
        }
    }
    return true;
}
