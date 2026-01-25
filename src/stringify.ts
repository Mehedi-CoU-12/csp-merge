export function stringifyCsp(obj: Record<string, Set<string>>) {
    return Object.entries(obj)
        .map(([key, values]) => {
            if (values.size === 0) return key;

            return `${key} ${Array.from(values).join(" ")}`;
        })
        .join("; ");
}
