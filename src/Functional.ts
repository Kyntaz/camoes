import { Grammar } from "./Grammar";
import { StructureMapper } from "./StructureMapper";
import { Variable } from "./Variable";

let grammarCache: Grammar | null = null;

export const grammar = () => {
    grammarCache = new Grammar();
    return grammarCache;
}

export const variable = (
    name: string,
    {
        greedy = false,
        guard = (_value: string | StructureMapper) => true as boolean,
    } = {}
) => new Variable(name, { guard, greedy });

export const invoke = (matcher: string, variableName: string) => {
    if (!grammarCache) {
        throw new Error("Cannot invoke before creating a grammar.");
    }
    return grammarCache.invoke(matcher, variable(variableName));
}
