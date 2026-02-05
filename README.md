# csp-merge

Merge Content Security Policy (CSP) strings safely without breaking existing rules.

A small utility for intelligently merging CSP headers instead of overwriting them — perfect for Next.js, Express, and any Node.js framework.

---

## Why?

Manually overriding CSP headers is risky and error-prone. A small mistake can silently weaken your site’s security.

`csp-merge` merges CSP directives correctly by:

- ✓ Combining compatible directives (e.g., `script-src`, `style-src`)
- ✓ Overriding only directives that must be single-valued (e.g., `report-uri`)
- ✓ Deduplicating sources automatically
- ✓ Preserving existing security rules
- ✓ Full TypeScript support

---

## Install

```bash
npm install csp-merge
```

or

```bash
yarn add csp-merge
```

or

```bash
pnpm add csp-merge
```

## Basic Usage

```javascript
import { mergeCsp } from "csp-merge";

const existing = "default-src 'self'; script-src 'unsafe-inline'";
const incoming = "script-src https://cdn.example.com; img-src *";

const merged = mergeCsp(existing, incoming);

// default-src 'self'; script-src 'unsafe-inline' https://cdn.example.com; img-src *
// Notice: script-src sources are combined, img-src is added, default-src is preserved
```

## Next.js Middleware Example

```javascript
import { mergeCsp } from "csp-merge";
import { NextResponse } from "next/server";

export function middleware(request) {
    const response = NextResponse.next();
    const currentCsp = response.headers.get("Content-Security-Policy") || "";

    response.headers.set(
        "Content-Security-Policy",
        mergeCsp(currentCsp, "frame-ancestors 'self' https://trusted.com"),
    );

    return response;
}
```

## Express Example

```javascript
import { mergeCsp } from "csp-merge";

app.use((req, res, next) => {
    const current = res.getHeader("Content-Security-Policy") || "";
    const updated = mergeCsp(
        current,
        "frame-ancestors 'self' https://example.com",
    );

    res.setHeader("Content-Security-Policy", updated);
    next();
});
```

## How It Works

- Combines values for multi-value directives
  (script-src, style-src, frame-ancestors, etc.)

- Overrides single-value directives
  (report-uri, report-to)

- Deduplicates all sources automatically

- Preserves existing CSP rules instead of weakening them

## Advanced API

For more control, work directly with parsed CSP objects:

```javascript
import { parseCsp, mergeCspObjects, stringifyCsp } from "csp-merge";

// Parse CSP string into an object
const basePolicy = parseCsp("default-src 'self'; script-src 'unsafe-inline'");
// {
//   "default-src": Set(["'self'"]),
//   "script-src": Set(["'unsafe-inline'"])
// }

// Parse another policy
const additionalPolicy = parseCsp("script-src https://cdn.example.com; img-src *");

// Merge two parsed CSP objects
const merged = mergeCspObjects(basePolicy, additionalPolicy);

// Convert back to a CSP string
const result = stringifyCsp(merged);
// "default-src 'self'; script-src 'unsafe-inline' https://cdn.example.com; img-src *"
```

## TypeScript Support

Full TypeScript types included:

```typescript
import { mergeCsp, parseCsp, stringifyCsp } from "csp-merge";

const policy: string = mergeCsp(
  "default-src 'self'",
  "script-src https://example.com"
);

const parsed: Map<string, Set<string>> = parseCsp(policy);
```

## When Should You Use This?

- Modifying CSP headers in Next.js middleware
- Adding CSP rules in Express / Fastify
- Dynamically extending CSP rules in plugins or middleware
- Avoiding accidental CSP overrides
- Building CSP management systems

## License

MIT
© 2024 Mehedi Hassan
