import { Grammar } from "./Grammar";
import { Variable } from "./Variable";

let grammarCache: Grammar | null = null;

export const grammar = () => {
    grammarCache = new Grammar();
    return grammarCache;
}

export const variable = (name: string) => new Variable(name);

export const invoke = (matcher: string, variableName: string) => {
    if (!grammarCache) {
        throw new Error("Cannot invoke before creating a grammar.");
    }
    return grammarCache.invoke(matcher, variable(variableName));
}
