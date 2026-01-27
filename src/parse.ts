export function parseCsp(csp: string): Record<string, Set<string>> {
    const result: Record<string, Set<string>> = {};

    for (const part of csp.split(";")) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        const [directive, ...values] = trimmed.split(/\s+/);

        if (!result[directive]) {
            result[directive] = new Set();
        }

        values.forEach((v) => result[directive].add(v));
    }

    return result;
}
