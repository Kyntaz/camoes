import { Invocation } from "./Invocation";
import { helpers, RuleLiteral } from "./RuleLiteral";
import { mappersAreEqual } from "./StructureMapper";
import { Variable } from "./Variable";
import { VariableMap } from "./VariableMap";

export class ApplicationError extends Error { };

export const applyLiterals = (
    literals: RuleLiteral[],
    text: string,
    variableMap: VariableMap,
    {
        test = false,
    } = {}
): string => {
    return literals.reduce<string>((currentText, literal, i) => {
        if (helpers.isString(literal)) {
            return applyStringLiteral(literal, currentText);
        } else if (helpers.isVariable(literal)) {
            return applyVariableLiteral(
                literal,
                literals[i+1],
                currentText,
                variableMap,
                { test }
            );
        } else if (helpers.isInvocation(literal)) {
            return applyInvocationLiteral(literal, currentText, variableMap);
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
        throw new ApplicationError();
    }

    return text.replace(literal, "");
};

const applyVariableLiteral = (
    literal: Variable,
    nextLiteral: RuleLiteral,
    text: string,
    variableMap: VariableMap,
    {
        test = false,
    } = {}
) => {
    for (let i = 1; i < text.length; i++) {
        const remainder = text.slice(i);
        if (tryLiteral(nextLiteral, remainder, variableMap)) {
            const value = variableMap.get(literal.name);

            if (!value && !test) {
                variableMap.set(literal.name, text.slice(0, i));
            } else if (value && value !== text.slice(0, 1)) {
                throw new ApplicationError();
            }
            
            return remainder;
        }
    }
    throw new ApplicationError();
};

const applyRegExpLiteral = (literal: RegExp, text: string) => {
    const match = text.match(literal);
    if (!match || match?.index !== 0) {
        throw new ApplicationError();
    }
    return text.slice(match.length);
}

const applyInvocationLiteral = (
    literal: Invocation,
    text: string,
    variableMap: VariableMap,
    {
        test = false,
    } = {}
) => {
    const { remainingText, result } = literal.matcher.applyPartial(text);
    const value = variableMap.get(literal.variable.name);

    if (!value && !test) {
        variableMap.set(literal.variable.name, result);
    } else if (value && (typeof value !== "object" || !mappersAreEqual(result, value))) {
        throw new ApplicationError();
    }

    return remainingText;
}
