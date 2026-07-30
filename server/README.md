# Companion server

Small companion server for the app's server-backed features. Personal
deployment only — this isn't required to use the app, but a few things need
it running:

- **Memory photos** — attaching photos to a saved location's visit log.
  Always on; no extra config beyond the port.
- **Shield screensaver casting** — an optional add-on, off by default. See
  below.

## Setup

1. Add these to the project root's `.env.local` (already gitignored):
   ```
   SERVER_PORT=8201
   VITE_SERVER_URL=http://<this-machine's-LAN-IP>:8201
   ```
   `VITE_SERVER_URL` is what the frontend (running on any device on your LAN,
   including the one hosting the server) uses to reach it — it can't be
   `localhost` unless every device viewing the app is the same machine as
   the server.
2. Run the server: `npm run server`. This is a separate process from the
   frontend (`npm run dev`) — both need to be running for photos to upload
   or display.

Uploaded photos are stored under `server/uploads/<locationId>/<visitId>/`
(gitignored) and served back from there — nothing about them lives in a
database, the saved-locations `localStorage` record on the frontend just
keeps a list of URLs pointing at this server. Removing a memory from the
visit log does not currently delete its uploaded photos from disk; that's a
known gap, not yet cleaned up automatically.

## Optional add-on: Shield screensaver casting

Exports the current map view as a PNG and pushes it to an Nvidia Shield (or
other Android TV device) as a screensaver image, via Home Assistant. Off by
default — the server runs fine for photos without any of this configured.

1. In Home Assistant, go to your profile (bottom left) → **Security** tab →
   **Long-Lived Access Tokens** → **Create Token**. Copy the value — it's
   only shown once.
2. Add these to `.env.local`, alongside the vars from Setup above:
   ```
   HA_BASE_URL=http://10.100.10.21:8123
   HA_TOKEN=<the token from step 1>
   HA_SHIELD_ENTITY_ID=media_player.shield_android_tv_2
   PUBLIC_HOST=10.100.180.122

   VITE_ENABLE_SHIELD_CAST=true
   ```
   `PUBLIC_HOST` must be an address Home Assistant can reach — it's baked
   into the URL Home Assistant is told to fetch the image from, so it can't
   be `localhost`. If Home Assistant (`10.100.10.x`) and this machine
   (`10.100.180.x`) are on different VLANs, inter-VLAN routing/firewall
   rules need to allow HA to reach this machine's port — check that if the
   API call succeeds but nothing appears on the TV.
3. Restart the server (`npm run server`). It only mounts the Shield route
   when all four `HA_*`/`PUBLIC_HOST` vars are present — leaving any one
   unset keeps it off, logged at startup, without affecting photos.

### Known caveat

`media_player.shield_android_tv_2` is Home Assistant's `androidtv_remote`
integration — built for launching apps/deep links via `play_media`, not
confirmed to reliably display a full-screen image. If clicking "Send to
Shield" reports success but nothing (or the wrong thing) appears on the TV,
the fallback is setting up Home Assistant's Google Cast integration for the
device instead (Settings → Devices & Services → Add Integration → Google
Cast, on the same device) and pointing `HA_SHIELD_ENTITY_ID` at the
resulting `cast.*` entity — no other code changes needed.
