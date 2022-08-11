import { Invocation } from "./Invocation";
import { Variable } from "./Variable";

export type RuleLiteral = string | Variable | Invocation | RegExp;
export const helpers = {
    isString: (literal: RuleLiteral): literal is string => typeof literal === "string",
    isVariable: (literal: RuleLiteral): literal is Variable => literal instanceof Variable,
    isInvocation: (literal: RuleLiteral): literal is Invocation => literal instanceof Invocation,
    isRegExp: (literal: RuleLiteral): literal is RegExp => literal instanceof RegExp,
};
