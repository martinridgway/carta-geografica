import express from "express";
import cors from "cors";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, "screenshots");

const {
  HA_BASE_URL,
  HA_TOKEN,
  HA_SHIELD_ENTITY_ID,
  PUBLIC_HOST,
  SCREENSAVER_SERVER_PORT = "8201"
} = process.env;

const REQUIRED_ENV_VARS = [
  "HA_BASE_URL",
  "HA_TOKEN",
  "HA_SHIELD_ENTITY_ID",
  "PUBLIC_HOST"
];
const missing = REQUIRED_ENV_VARS.filter(name => !process.env[name]);

if (missing.length) {
  console.error(
    `Missing required env var(s) in .env.local: ${missing.join(", ")}. See server/README.md.`
  );
  process.exit(1);
}

await mkdir(screenshotsDir, { recursive: true });

const app = express();
const port = Number(SCREENSAVER_SERVER_PORT);

app.use(cors());
app.use("/screenshots", express.static(screenshotsDir));

app.post(
  "/api/screensaver/send",
  express.raw({ type: "image/png", limit: "10mb" }),
  async (req, res) => {
    if (!req.body || !req.body.length) {
      res.status(400).json({ error: "No image data received" });
      return;
    }

    const filename = `screenshot-${Date.now()}.png`;

    try {
      await writeFile(join(screenshotsDir, filename), req.body);

      const imageUrl = `http://${PUBLIC_HOST}:${port}/screenshots/${filename}`;

      const haResponse = await fetch(
        `${HA_BASE_URL}/api/services/media_player/play_media`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HA_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            entity_id: HA_SHIELD_ENTITY_ID,
            media_content_id: imageUrl,
            media_content_type: "image/png"
          })
        }
      );

      if (!haResponse.ok) {
        const body = await haResponse.text();
        throw new Error(`Home Assistant responded ${haResponse.status}: ${body}`);
      }

      res.json({ ok: true, url: imageUrl });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

app.listen(port, () => {
  console.log(`Screensaver server listening on http://${PUBLIC_HOST}:${port}`);
});
