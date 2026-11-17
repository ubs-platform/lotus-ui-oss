export function cloneObjectDeep<T extends object>(obj: T): T {
    if (typeof structuredClone === "function") {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
}
