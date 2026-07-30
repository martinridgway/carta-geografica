# CLAUDE.md — carta-geografica

*Carta Geografica* — React + OpenLayers app rendering an art-styled map (Stadia Maps watercolor tiles) for a wall-mounted display. Public repo, AGPL-3.0. **Read `docs/PROJECT.md` first** — it's a lean index pointing to `docs/history/*.md` (monthly logs) and `docs/PLAN-*.md` (designed-not-started work). Don't duplicate that detail here; this file stays minimal on purpose.

**Stack**: React 19 + Vite, OpenLayers 10, Sass. `server/` holds an optional, currently-disabled companion server (personal Shield-screensaver feature) — see `docs/PROJECT.md` before touching it.

## Standing conventions
- **Local dev server always defaults to port 8200** (Martin's convention, avoids clashing with other local projects) — set as `server.port` in `vite.config.js`.
- Commit as author Martin Ridgway (email already in this repo's git config).
- Documentation is finished *before* every push, and pushed together with the code — not as a follow-up. Keep `docs/PROJECT.md` to an index; put real detail in `docs/history/YYYY-MM.md` and `docs/PLAN-*.md`.
