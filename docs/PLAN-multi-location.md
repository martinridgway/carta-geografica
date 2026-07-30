# PLAN — multiple saved locations, shown on one screen or many

Status: **designed, not started** (2026-07-30). This is the README's original pitch, never fully built: "choose one or many locations, showcase them across one screen or many screens... from an easy-to-use location picker." The search box (built earlier) covers "easy-to-use location picker" for a single location; this plan covers the "one or many locations" / "one or many screens" part.

## Context

Today the app shows exactly one location at a time, replaced on every search — no saved collection, no way to display more than one location at once. Martin's direction: build a real, usable first pass now, see how it feels, decide what's next from there — not a token slice, but also not over-built ahead of that feedback.

**Scope call, stated explicitly rather than assumed**: "many screens" here means multiple browser windows/kiosk displays pointed at different URLs on the *same* app instance, synced via `localStorage` (instant across tabs/windows on one machine — the realistic setup for a Pi/mini-PC driving several wall-mounted panels). It does **not** yet mean synced state across genuinely separate devices on the network (that would need a small backend, the same shape of thing already built once for the paused Shield feature) — that's a natural next decision point once this version has been tried, not something to build preemptively now.

## Design

**Data model** — `src/services/locations.js`, a small `localStorage`-backed store (key `carta-geografica:locations`), each entry `{ id, address, lat, lon, savedAt }`:
- `getLocations()`, `saveLocation({ address, lat, lon })`, `removeLocation(id)`.
- Change notifications via a custom `locations-changed` window event (fired on every write) *plus* listening for the native `storage` event — `storage` only fires in *other* tabs/windows on the same origin, not the one that made the change, so both are needed for every window to stay in sync live.
- `src/hooks/useLocations.js` — thin hook wrapping `getLocations()` + the subscription, used by every component that needs the live list.

**Fix required in `src/components/map.jsx`**: it currently hardcodes `target: "map"` (a string id) and renders `<div id="map" />`. OL resolves a string target via `document.getElementById`, so two mounted `Map` instances would collide on the same id and the second would silently fail to find its target. Switch to passing the DOM node directly (`useRef` on the div, `target: mapElRef.current`) — OL supports an element target directly, and this is what actually enables the gallery view below (multiple simultaneous map instances).

**URL-driven view modes** in `src/App.jsx` (read once via `new URLSearchParams(window.location.search)`, no router dependency needed for three states):
- Default (no params) → **Control view**: today's experience (search, map, panel) plus a "Save location" button and a list of saved locations to jump between. This is the "operator" screen.
- `?view=gallery` → **Gallery view**: every saved location rendered at once as its own small map + label, in a grid. This is "one screen, many locations."
- `?location=<id>` → **Kiosk view**: exactly one saved location, full-screen, map + panel only — no search/save/list chrome. Point a wall-mounted screen's browser at `http://<host>:8200/?location=<id>` for that screen's permanent display. This is "many screens."

**New/changed files**:
- `src/services/locations.js`, `src/hooks/useLocations.js` — as above.
- `src/components/map.jsx` — ref-based target fix (above).
- `src/components/control-view.jsx` (new) — today's `App.jsx` body (search, map, panel, Shield button when enabled), plus a new `SaveButton` and `LocationList`.
- `src/components/save-button.jsx` (new) — saves the currently-displayed location; brief "Saved!" confirmation state.
- `src/components/location-list.jsx` (new) — saved locations as a small list/strip; click one to jump to it instantly (no re-geocoding — the lat/lon/address are already stored), each with a remove control. Renders nothing when the list is empty.
- `src/components/gallery.jsx` (new) — grid of `<Map>` + label per saved location; empty state ("No saved locations yet") when there are none.
- `src/components/kiosk-view.jsx` (new) — looks up the `location` param's id via `useLocations()`, renders `<Map>` + `<Panel>` for it, or a small "location not found" message if the id doesn't match anything saved.
- `src/App.jsx` — becomes a thin switch between Control / Gallery / Kiosk based on the URL params.
- `src/index.scss` — rework the `#map` absolute-positioning rule to a `.map-target` class (contextual sizing: full-bleed in control/kiosk view, fixed card size in gallery), plus new styles for the save button, location list, and gallery grid.
- `README.md` — short usage section for saving locations and the `?view=gallery` / `?location=<id>` URL scheme (so this is actually discoverable, matching the README's own "build guides" framing at a basic level).
- `docs/history/2026-0X.md` (current month) — status entry once built, same log convention as before; update `docs/PROJECT.md`'s index line for that month too.

## Verification

- `npm run dev`, confirm the default view is unchanged (Boston loads, search still works) plus a new "Save location" button.
- Save 2-3 different searched locations; confirm they appear in the location list and clicking one jumps instantly (no network request — check via network tab that it's not re-hitting Nominatim).
- Remove one; confirm it disappears from the list.
- Open `?view=gallery` in a second tab: confirm all remaining saved locations render as independent small maps with correct tiles/labels (this is the real test of the `map.jsx` target fix — watch for any DOM id collisions or a map rendering into the wrong card).
- Open `?location=<id>` for one saved location in a third tab: confirm it renders full-screen with no search/save/list UI, and confirm saving a new location in the first tab updates the gallery tab live (via the `storage` event) without a manual reload.
- Try `?location=` with a bogus id: confirm a graceful "not found" message, not a crash.
- `npm run build` to confirm the production bundle still compiles cleanly.
