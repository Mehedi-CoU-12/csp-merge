// src/merge.ts
var SINGLE_VALUE_DIRECTIVES = /* @__PURE__ */ new Set(["report-uri", "report-to"]);
var SPECIAL_DIRECTIVES = /* @__PURE__ */ new Set(["frame-ancestors"]);
function mergeCspObjects(a, b) {
  const result = { ...a };
  for (const key in b) {
    if (!result[key]) {
      result[key] = new Set(b[key]);
      continue;
    }
    if (SINGLE_VALUE_DIRECTIVES.has(key)) {
      result[key] = new Set(b[key]);
    } else if (SPECIAL_DIRECTIVES.has(key)) {
      const incoming = b[key];
      if (incoming.has("'none'")) {
        result[key] = /* @__PURE__ */ new Set(["'none'"]);
      } else {
        result[key] = /* @__PURE__ */ new Set([
          ...Array.from(result[key]).filter((v) => v !== "'none'"),
          ...incoming
        ]);
      }
    } else {
      b[key].forEach((v) => result[key].add(v));
    }
  }
  return result;
}

// src/parse.ts
function parseCsp(csp) {
  const result = {};
  for (const part of csp.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const [directive, ...values] = trimmed.split(/\s+/);
    if (!result[directive]) {
      result[directive] = /* @__PURE__ */ new Set();
    }
    values.forEach((v) => result[directive].add(v));
  }
  return result;
}

// src/stringify.ts
function stringifyCsp(obj) {
  return Object.entries(obj).map(([key, values]) => {
    if (values.size === 0) return key;
    return `${key} ${Array.from(values).join(" ")}`;
  }).join("; ");
}

// src/index.ts
function mergeCsp(existing, incoming) {
  const a = parseCsp(existing);
  const b = parseCsp(incoming);
  const merged = mergeCspObjects(a, b);
  return stringifyCsp(merged);
}
export {
  mergeCsp
};
