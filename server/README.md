# Screensaver server

Small companion server for the optional "Send to Shield" feature — exports
the current map view as a PNG and pushes it to an Nvidia Shield (or other
Android TV device) as a screensaver image, via Home Assistant. Personal
deployment only; inert unless configured.

## Setup

1. In Home Assistant, go to your profile (bottom left) → **Security** tab →
   **Long-Lived Access Tokens** → **Create Token**. Copy the value — it's
   only shown once.
2. Add these to the project root's `.env.local` (already gitignored):
   ```
   HA_BASE_URL=http://10.100.10.21:8123
   HA_TOKEN=<the token from step 1>
   HA_SHIELD_ENTITY_ID=media_player.shield_android_tv_2
   PUBLIC_HOST=10.100.180.122
   SCREENSAVER_SERVER_PORT=8201

   VITE_ENABLE_SHIELD_CAST=true
   VITE_SCREENSAVER_SERVER_URL=http://10.100.180.122:8201
   ```
   `PUBLIC_HOST` must be an address Home Assistant can reach — it's baked
   into the URL Home Assistant is told to fetch the image from, so it can't
   be `localhost`. If Home Assistant (`10.100.10.x`) and this machine
   (`10.100.180.x`) are on different VLANs, inter-VLAN routing/firewall
   rules need to allow HA to reach this machine's port — check that if the
   API call succeeds but nothing appears on the TV.
3. Run the server: `npm run server`. This is a separate process from the
   frontend (`npm run dev`) — both need to be running for the button to
   work.

## Known caveat

`media_player.shield_android_tv_2` is Home Assistant's `androidtv_remote`
integration — built for launching apps/deep links via `play_media`, not
confirmed to reliably display a full-screen image. If clicking "Send to
Shield" reports success but nothing (or the wrong thing) appears on the TV,
the fallback is setting up Home Assistant's Google Cast integration for the
device instead (Settings → Devices & Services → Add Integration → Google
Cast, on the same device) and pointing `HA_SHIELD_ENTITY_ID` at the
resulting `cast.*` entity — no other code changes needed.
