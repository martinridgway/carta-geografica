# Carta Geografica

*Carta Geografica* - sounds ace, right? It just means "map" in Italian...

The digital world is full of beautiful maps, but we don't treat them like the art they are. This project aims to change that, with its perspective firmly placed on picking a location that's important to you, and highlighting it using a beautiful digital map template. Of course, you'll be able to choose one or many locations, showcase them across one screen or many screens, and do all that from an easy-to-use location picker in your browser.

As we near release, we'll share recommended hardware and build guides to get you started creating a wall-mounted map display of your own.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- [NodeJS](https://nodejs.org/en/) `^20.19.0` or `>=22.12.0`
- A free [Stadia Maps](https://stadiamaps.com) account and API key (used to serve the watercolor map tiles — no credit card required)

### Installing

1. Clone this repository
2. Install dependencies with `npm install`
3. Create a `.env.local` file in the project root with your Stadia Maps key:
   ```
   VITE_STADIA_API_KEY=your-key-here
   ```
4. Run the application with `npm run dev`

Open http://localhost:5173/ in your browser, and voila! (Vite's default port. Override it by setting `APP_PORT` in `.env.local` if it clashes with something else you're running.)

## Saving and displaying locations

The default view (`/`) is the control screen — search for a place, then click **Save location** to add it to your saved list, shown just below. Click any saved location to jump to it instantly (no re-geocoding), or remove it with the &times; button. Saved locations live in the browser's `localStorage`, so they're shared live across every tab/window pointed at the same app instance on the same machine. A **Gallery view** link in the bottom-right takes you to the next view below.

Once a location is saved (or re-selected from the list), a small log appears under its coordinates in the panel — add a dated memory ("First weekend trip together") each time the place means something again, and it accumulates into a scrapbook instead of a static caption. It's editable anywhere there's a way back (the control screen, and a gallery's **Full map** link); the chromeless URL, meant for a permanently mounted display, shows it read-only with no form.

A memory can optionally be pinned to an exact spot: click **Pin a spot** next to the form, then click anywhere on that location's map. A marker appears wherever that location is shown (control screen, gallery thumbnails, full map, chromeless) so a memory can read as tied to a specific place within the map, not just the location as a whole.

A memory can also carry a series of photos — attach one or more when adding it, and a pinned memory with photos renders as a small photo marker on the map (the exact spot stays marked by a triangle tail below the thumbnail, not covered by it). Click a photo marker, or the thumbnail chip next to its entry in the log, to open a full-size viewer. This needs the companion server running — see "Companion server" below; without it, everything else in this section still works, just without photos.

Two more URLs read from that same saved list:

- `/?view=gallery` — every saved location at once, each as its own small map, with a **&larr; Back** link to the control screen. Good for a single "overview" screen. Each card has two links to view that location alone, full-screen:
  - **Full map** — the location full-screen with a small **&larr; Gallery** link, for browsing your saved locations one at a time.
  - **Chromeless** — the same full-screen map with no UI at all. Point a wall-mounted display's browser permanently at this URL for a dedicated screen.
- `/?location=<id>` — the chromeless URL directly (what the "Chromeless" gallery link points to). Add `&nav=1` for the version with the back link (what "Full map" points to).

## Deployment

To create a production bundle of your application, run `npm run build` and deploy the resulting `dist/` folder to your production server. Run `npm run preview` to check the production build locally first.

Remember to configure `VITE_STADIA_API_KEY` in your production environment too — Vite only bakes in env vars present at build time.

### Companion server

`server/` is a small Node/Express server for the app's server-backed features — currently just memory photos (see above). It's optional: everything else in the app works without it. See `server/README.md` for setup.

It also hosts an optional add-on, off by default: pushing the current map view to an Nvidia Shield (or similar Android TV device) as a screensaver image, via Home Assistant. Inert unless `VITE_ENABLE_SHIELD_CAST` is set — see `server/README.md`.

## Built With

- [React](https://react.dev/) 19
- [OpenLayers](https://openlayers.org/) 10
- [Vite](https://vite.dev/)

## Contributing

Our [Contributor Covenant](https://github.com/martinridgway/carta-geografica/blob/master/CODE_OF_CONDUCT.md) is available to read, and generated from the excellent work by https://www.contributor-covenant.org/

## Versioning

Coming soon

## Authors

* **Martin Ridgway** - *Initial work* - [martinridgway](https://github.com/martinridgway)
* **Derek Montgomery** - *Much less dumb v2 rewrite* - [DerektheDev](https://github.com/derekthedev)

See also the list of [contributors](https://github.com/carta-geografica/contributors) who participated in this project. Coming soon

## License

Our [AGPL-3.0 license is here](https://github.com/martinridgway/carta-geografica/blob/master/LICENSE).

## Acknowledgments

- The amazing [OpenLayers](https://openlayers.org/) project
- [Stamen Watercolors](http://maps.stamen.com/) map
