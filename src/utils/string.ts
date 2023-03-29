/* token 分割 */
export function tokenSplit(token: string): string[] {
    return token
        .replaceAll("\\,", "\n")
        .split(",")
        .map(t => t.replaceAll("\n", ","));
}

export function isCustomAttrKey(key: string): boolean {
    return key.startsWith("custom-");
}

/**
 * REF https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!
 */
export function looseJsonParse(josn: string): any {
    return eval?.(`"use strict";(${josn})`);
}
