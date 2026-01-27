// Single-value directives (override completely)
const SINGLE_VALUE_DIRECTIVES = new Set(["report-uri", "report-to"]);

const SPECIAL_DIRECTIVES = new Set(["frame-ancestors"]);

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
            // Always override single-value directives
            result[key] = new Set(b[key]);
        } else if (SPECIAL_DIRECTIVES.has(key)) {
            // Special merging rules for 'frame-ancestors'
            const incoming = b[key];
            if (incoming.has("'none'")) {
                // 'none' overrides everything
                result[key] = new Set(["'none'"]);
            } else {
                // Merge and deduplicate, remove 'none' if present in existing
                result[key] = new Set([
                    ...Array.from(result[key]).filter((v) => v !== "'none'"),
                    ...incoming,
                ]);
            }
        } else {
            // Regular merge for all other directives
            b[key].forEach((v) => result[key].add(v));
        }
    }

    return result;
}
