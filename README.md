# Install

```bash
npm install csp-merge
```

## Usage

```javascript
import { mergeCsp } from "csp-merge";

const existing = "default-src 'self'; script-src 'unsafe-inline'";
const incoming = "script-src https://cdn.example.com; img-src *";

const merged = mergeCsp(existing, incoming);
// "default-src 'self'; script-src 'unsafe-inline' https://cdn.example.com; img-src *"
```

```javascript
import { mergeCsp } from "csp-merge";

export function middleware(request) {
    const response = NextResponse.next();
    const csp = response.headers.get("Content-Security-Policy") || "";

    response.headers.set(
        "Content-Security-Policy",
        mergeCsp(csp, "frame-ancestors 'self' https://trusted.com"),
    );

    return response;
}
```

# csp-merge

Merge Content Security Policy (CSP) strings safely without breaking existing rules.

## Why?

Manually overriding CSP headers is dangerous and error-prone. This package merges CSP directives intelligently, combining values where appropriate and handling special cases correctly.

Perfect for Next.js, Express, and any framework where you need to modify CSP headers dynamically.

## Installation

### Basic

<!-- ### Express
```javascript
app.use((req, res, next) => {
  const current = res.getHeader('Content-Security-Policy');
  const updated = mergeCsp(current, "frame-ancestors 'self' https://example.com");
  res.setHeader('Content-Security-Policy', updated);
  next();
});
``` -->

### Next.js Middleware

## How it Works

- **Combines** values for most directives (e.g., `script-src`, `frame-ancestors`)
- **Overrides** single-value directives (`report-uri`, `report-to`)
- **Deduplicates** all sources automatically
- **Preserves** existing security policies

## Advanced API

```javascript
import { parseCsp, mergeCspObjects, stringifyCsp } from "csp-merge";

// Parse CSP string into object
const parsed = parseCsp("default-src 'self'; script-src 'unsafe-inline'");
// { "default-src": Set(["'self'"]), "script-src": Set(["'unsafe-inline'"]) }

// Merge two parsed objects
const merged = mergeCspObjects(parsed, anotherParsed);

// Convert back to string
const result = stringifyCsp(merged);
```

## License

MIT
