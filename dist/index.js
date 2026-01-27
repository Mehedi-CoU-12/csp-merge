// src/merge.ts
var SINGLE_VALUE_DIRECTIVES = /* @__PURE__ */ new Set(["report-uri", "report-to"]);
function mergeCspObjects(a, b) {
  const result = { ...a };
  for (const key in b) {
    if (!result[key]) {
      result[key] = new Set(b[key]);
      continue;
    }
    if (SINGLE_VALUE_DIRECTIVES.has(key)) {
      result[key] = new Set(b[key]);
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
    const trimmmed = part.trim();
    if (!trimmmed) continue;
    const [directive, ...values] = trimmmed.split(/\s+/);
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
