const SINGLE_VALUE_DIRECTIVES = new Set(["report-uri", "report-to"]);

export function mergeCspObjects(
    a: Record<string, Set<string>>,
    b: Record<string, Set<string>>,
) {
    const result: Record<string, Set<string>> = { ...a };

    for (const key in b) {
        if (!result[key]) {
            result[key] = new Set(b[key]);
            continue;
        }

        if (SINGLE_VALUE_DIRECTIVES.has(key)) {
            result[key] = new Set(b[key]); // Override with b's value
        } else {
            b[key].forEach((v) => result[key].add(v));
        }
    }

    return result;
}
