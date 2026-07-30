import express from "express";
import cors from "cors";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { createPhotosRouter } from "./routes/photos.js";
import { createScreensaverRouter } from "./routes/screensaver.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = join(__dirname, "uploads");
const screenshotsDir = join(__dirname, "screenshots");

const {
  SERVER_PORT = "8201",
  HA_BASE_URL,
  HA_TOKEN,
  HA_SHIELD_ENTITY_ID,
  PUBLIC_HOST
} = process.env;

await mkdir(uploadsDir, { recursive: true });
await mkdir(screenshotsDir, { recursive: true });

const app = express();
const port = Number(SERVER_PORT);

app.use(cors());
app.use("/uploads", express.static(uploadsDir));
app.use("/api/photos", createPhotosRouter(uploadsDir));

// Shield is an optional add-on to this server, not the reason it runs — only
// wired up when its Home Assistant config is present, so the server can't be
// blocked from starting by a personal feature nobody else has configured.
const shieldConfigured = [HA_BASE_URL, HA_TOKEN, HA_SHIELD_ENTITY_ID, PUBLIC_HOST].every(
  Boolean
);

if (shieldConfigured) {
  app.use("/screenshots", express.static(screenshotsDir));
  app.use(
    "/api/screensaver",
    createScreensaverRouter({
      screenshotsDir,
      haBaseUrl: HA_BASE_URL,
      haToken: HA_TOKEN,
      shieldEntityId: HA_SHIELD_ENTITY_ID,
      publicHost: PUBLIC_HOST,
      port
    })
  );
  console.log("Shield screensaver route enabled.");
} else {
  console.log(
    "Shield screensaver route disabled (set HA_BASE_URL, HA_TOKEN, HA_SHIELD_ENTITY_ID, PUBLIC_HOST in .env.local to enable)."
  );
}

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
