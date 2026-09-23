<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run lint` — runs bare `eslint` over the whole repo. Currently fails: all errors come from `references/pantallas/support.js` (generated design-mockup code, not app code). Lint app code only: `npx eslint app`
- No test framework or test script exists — don't assume jest/vitest.
- No typecheck script — `npm run build` runs type checking; `npx tsc --noEmit` also works.

## Stack

- Next.js 16 App Router at `app/` (no `src/`), React 19, strict TypeScript.
- Tailwind v4, CSS-first: there is no `tailwind.config.*`. Theme tokens are defined in `app/globals.css` via `@import "tailwindcss"` + `@theme inline`; PostCSS plugin is `@tailwindcss/postcss`.
- Import alias: `@/*` maps to the repo root (e.g. `@/app/...`).
- Next 16 typed props: pages/layouts use generated global prop types (`PageProps<"/">`, `LayoutProps<"/">`) instead of inline types — see `app/layout.tsx`.

## Project state & design references

- `app/` is still the stock create-next-app template; features are pre-implementation.
- Product is a daycare app ("guardería"); UI/domain naming is in Spanish.
- Design source of truth: `references/pantallas/*.dc.html` (HTML mockups: login, feed, niños, avisos, resumen-día, …) and `references/screenshots/*.png`. `references/` and `.playwright-mcp/` are gitignored — local-only, absent on fresh clones. Consult them for UI work, but never reference them from app code.

## Workflow

- Spec-driven: use the `spec` skill to draft a spec before large features, `spec-impl` to implement an approved spec (it creates and switches to its own branch).
- `CLAUDE.md` only imports this file (`@AGENTS.md`) — make edits here.

## MCPs

- PLaywright Screenshots y cualquier cosa relacionada a Playwright tiene que estar en la carpeta .playwright-mcp
- Context7 Usaremos este MCP par traer la documentación actualizada del framework.

## Global Skills

The following skills are available globally from `/Users/juanmamc/.config/opencode/skills/`:

- `supabase` - Use when doing ANY task involving Supabase. Products: Database, Auth, Edge Functions, Realtime, Storage, Vectors, Cron, Queues; client libraries and SSR integrations in Next.js, React, SvelteKit, Astro, Remix; auth issues; Supabase CLI or MCP server; schema changes, migrations, declarative schemas, security audits, Postgres extensions; debugging and troubleshooting errors or unexpected behavior on Supabase projects.
- `supabase-postgres-best-practices` - Postgres best practices maintained by Supabase for creating/altering tables and columns, schema design, migrations, RLS policies, indexes, triggers, database functions, pg_cron, pgmq, pgvector, restoring dumps, and debugging slow queries.
- `spec` - Designs and develops specs following the spec-driven method. Asks clarifying questions before proposing structure, and builds the spec section by section. Use it when starting a large feature, before writing code.
- `spec-impl` - Implements an approved spec. Validates that the state means "Approved" (in any language), creates a git branch named after the spec, switches to it, and starts the implementation step by step with pauses to review diffs.

## Spec Driven Developments - Skills

- /spec Usaremos esta habilidad para crear las especificaciones.
- /spec-impl Usaremos esta skill pra hacer las implementaciones.
- /spec-verifier Agente verificador de criterios de aceptación de un spec. Revisa, corrige y marca los checks del "Acceptance criteria". Usa Context7 para verificar recomendaciones de Next.js y el MCP de Playwright para verificar pantallas creadas (requiere modelo con visión). Se activa con Tab o escribiendo /spec-verifier.

## Reglas de código

- Usar código limpio, nombres, funcions, variables, etc en inglés.

## Reglas del Agente

- Responder siempre en español
- No levantar el servidor nunca sin mi permiso