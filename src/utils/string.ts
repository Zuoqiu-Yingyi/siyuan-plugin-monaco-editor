/* token 分割 */
export function tokenSplit(token: string): string[] {
    return token
        .replaceAll("\\,", "\n")
        .split(",")
        .map(t => t.replaceAll("\n", ","));
}
