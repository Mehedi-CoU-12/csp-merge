const SINGLE_VALUE_DIRECTIVES = new Set(["report-uri", "report-to"]);

export function mergeCspObjects(
    a: Record<string, Set<string>>,
    b: Record<string, Set<string>>,
) {
    const result: Record<string, Set<string>> = { ...a };
    
}
