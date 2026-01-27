# csp-merge

Safely merge Content-Security-Policy (CSP) headers without overwriting existing directives.

## Install

```bash
npm install csp-merge
```

# Why?

Overwriting CSP headers is dangerous.
This package merges CSP directives safely and deduplicates values.
