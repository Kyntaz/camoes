import { StructureMapper } from "./StructureMapper";

export type VariableMap = Map<string, string | StructureMapper>;
export const makeEmptyVariableMap = () => new Map<string, string | StructureMapper>() as VariableMap;
