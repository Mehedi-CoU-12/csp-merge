import { mergeCspObjects } from "./merge";
import { parseCsp } from "./parse";
import { stringifyCsp } from "./stringify";

export function mergeCsp(existing: string, incoming: string): string {
    const a = parseCsp(existing);
    const b = parseCsp(incoming);

    const merged = mergeCspObjects(a, b);
    return stringifyCsp(merged);
}
