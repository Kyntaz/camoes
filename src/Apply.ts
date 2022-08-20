import { Invocation } from "./Invocation";
import { Logger } from "./Logger";
import { helpers, RuleLiteral } from "./RuleLiteral";
import { mappersAreEqual } from "./StructureMapper";
import { Variable } from "./Variable";
import { VariableMap } from "./VariableMap";

export class ApplicationError extends Error { };

export const getErrorAndLog = (message?: string) => {
    if (message) {
        Logger.log(message)
    }
    return new ApplicationError(message);
}

export const applyLiterals = (
    literals: RuleLiteral[],
    text: string,
    variableMap: VariableMap,
    {
        test = false,
        nextLiteral = null as RuleLiteral | null,
    } = {}
): string => {
    return literals.reduce<string>((currentText, literal, i) => {
        if (helpers.isString(literal)) {
            return applyStringLiteral(literal, currentText);
        } else if (helpers.isVariable(literal)) {
            return applyVariableLiteral(
                literal,
                (i + 1 < literals.length) ? literals[i+1] : nextLiteral,
                currentText,
                variableMap,
                { test }
            );
        } else if (helpers.isInvocation(literal)) {
            return applyInvocationLiteral(
                literal,
                currentText,
                variableMap,
                {
                    test,
                    nextLiteral: (i + 1 < literals.length) ? literals[i+1] : nextLiteral,
                }
            );
        } else if (helpers.isRegExp(literal)) {
            return applyRegExpLiteral(literal, currentText);
        } else {
            throw new Error("Invalid rule literal");
        }
    }, text);
};

const tryLiteral = (literal: RuleLiteral, text: string, variableMap: VariableMap) => {
    try {
        applyLiterals([literal], text, variableMap, { test: true });
        return true;
    } catch (e) {
        if (e instanceof ApplicationError) {
            return false;
        }
        throw e;
    }
};

const applyStringLiteral = (literal: string, text: string) => {
    if (!text.startsWith(literal)) {
        throw getErrorAndLog(`Can't apply string literal: "${text}" does not start with ${literal}.`);
    }

    return text.replace(literal, "");
};

const applyVariableLiteral = (
    literal: Variable,
    nextLiteral: RuleLiteral | null,
    text: string,
    variableMap: VariableMap,
    {
        test = false,
    } = {}
) => {
    let realValue: string | null =  null;
    let remainder = "";

    if (nextLiteral) {
        for (let i = text.length - 1; i >= 0; i--) {
            const value = text.slice(0, i);
            remainder = text.slice(i);
            if (tryLiteral(nextLiteral, remainder, variableMap) && literal.guard(value)) {
                realValue = value;
                break;
            }
        }
    } else {
        realValue = text;
    }
    
    if (!realValue || !literal.guard(realValue)) {
        throw getErrorAndLog(`Can't apply variable literal: No valid configuration for ${literal.name} found in "${text}".`);
    }

    const value = variableMap.get(literal.name);

    if (!value && !test) {
        variableMap.set(literal.name, realValue);
    } else if (value && value !== realValue) {
        throw getErrorAndLog(
            `Can't apply variable literal: ${literal.name}'s value "${value}" and "${realValue}" do not match.`
        );
    }
    
    return remainder;
};

const applyRegExpLiteral = (literal: RegExp, text: string) => {
    const match = text.match(literal);
    if (!match || match?.index !== 0) {
        throw getErrorAndLog(`Can't apply regex literal: "${text}" doesn't start with /${literal.source}/.`);
    }
    return text.slice(match[0].length);
}

const applyInvocationLiteral = (
    literal: Invocation,
    text: string,
    variableMap: VariableMap,
    {
        test = false,
        nextLiteral = null as RuleLiteral | null,
    } = {}
) => {
    const { remainingText, result } = literal.matcher.applyPartial(text, { nextLiteral });

    if (!literal.variable.guard(result)) {
        throw getErrorAndLog(`Can't apply invocation literal: Result did not match guard.`);
    }

    const value = variableMap.get(literal.variable.name);

    if (!value && !test) {
        variableMap.set(literal.variable.name, result);
    } else if (value && (typeof value !== "object" || !mappersAreEqual(result, value))) {
        throw getErrorAndLog(
            `Can't apply invocation literal: ${literal.matcher}'s mapper was ${JSON.stringify(result)} and should be ${JSON.stringify(value)}`
        );
    }

    return remainingText;
}
