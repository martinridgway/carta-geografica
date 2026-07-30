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

Open http://localhost:8200/ in your browser, and voila! (This project's local dev server always runs on port 8200, not Vite's default 5173, to avoid clashing with other projects running locally.)

## Deployment

To create a production bundle of your application, run `npm run build` and deploy the resulting `dist/` folder to your production server. Run `npm run preview` to check the production build locally first.

Remember to configure `VITE_STADIA_API_KEY` in your production environment too — Vite only bakes in env vars present at build time.

### Optional: personal Shield screensaver feature

There's a small optional feature for pushing the current map view to an Nvidia Shield (or similar Android TV device) as a screensaver image, via Home Assistant. It's inert unless `VITE_ENABLE_SHIELD_CAST` is set, and requires the companion server in `server/` to be running alongside the frontend — see `server/README.md` for setup.

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
