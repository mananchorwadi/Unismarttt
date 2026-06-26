---
name: esbuild JSX conversion
description: How to bulk-convert .tsx/.ts files to .jsx/.js stripping TypeScript while keeping JSX intact
---

## Rule
Use `node_modules/.bin/esbuild file.tsx --jsx=preserve --bundle=false > file.jsx` (no `--loader` flag — that's stdin-only).
After conversion, strip `"use strict";` from line 1 of every output file or Vite may fail to serve them as proper ES modules.

**Why:** `--loader=tsx` only works when reading from stdin; specifying it with a file argument causes esbuild to error silently (empty output). The `"use strict"` directive esbuild adds before import statements can interfere with Vite's module handling.

**How to apply:**
```bash
for f in src/**/*.tsx; do
  out="${f%.tsx}.jsx"
  node_modules/.bin/esbuild "$f" --jsx=preserve --bundle=false > "$out"
  # strip "use strict" if present on line 1
  head -1 "$out" | grep -q '"use strict"' && { tail -n +2 "$out" > tmp && mv tmp "$out"; }
done
```
Files with wouter imports (App, auth-page, sidebar, protected-route) must be rewritten manually to use react-router-dom — esbuild strips types but keeps imports as-is.
