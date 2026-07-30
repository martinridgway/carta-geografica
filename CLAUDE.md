# CLAUDE.md — carta-geografica

*Carta Geografica* — React + OpenLayers app rendering an art-styled map (Stadia Maps watercolor tiles) for a wall-mounted display. Public repo, AGPL-3.0. **Read `docs/PROJECT.md` first** — it's a lean index pointing to `docs/history/*.md` (monthly logs) and `docs/PLAN-*.md` (designed-not-started work). Don't duplicate that detail here; this file stays minimal on purpose.

**Stack**: React 19 + Vite, OpenLayers 10, Sass. `server/` holds an optional companion server — general-purpose (memory photo storage; more features likely over time), with the personal Shield-screensaver feature as an add-on that stays off until its own env vars are set — see `docs/PROJECT.md` before touching it.

## Standing conventions
- Local dev/preview server port is overridable via `APP_PORT` in `.env.local` (falls back to Vite's own default when unset) — wired into `server.port`/`preview.port` in `vite.config.js`.
- Commit as author Martin Ridgway (email already in this repo's git config).
- Documentation is finished *before* every push, and pushed together with the code — not as a follow-up. Keep `docs/PROJECT.md` to an index; put real detail in `docs/history/YYYY-MM.md` and `docs/PLAN-*.md`.
