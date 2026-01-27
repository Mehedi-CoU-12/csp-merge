"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  mergeCsp: () => mergeCsp
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mergeCsp
});
