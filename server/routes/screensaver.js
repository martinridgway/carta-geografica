import express from "express";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

export function createScreensaverRouter({
  screenshotsDir,
  haBaseUrl,
  haToken,
  shieldEntityId,
  publicHost,
  port
}) {
  const router = express.Router();

  router.post(
    "/send",
    express.raw({ type: "image/png", limit: "10mb" }),
    async (req, res) => {
      if (!req.body || !req.body.length) {
        res.status(400).json({ error: "No image data received" });
        return;
      }

      const filename = `screenshot-${Date.now()}.png`;

      try {
        await writeFile(join(screenshotsDir, filename), req.body);

        const imageUrl = `http://${publicHost}:${port}/screenshots/${filename}`;

        const haResponse = await fetch(
          `${haBaseUrl}/api/services/media_player/play_media`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${haToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              entity_id: shieldEntityId,
              media_content_id: imageUrl,
              media_content_type: "image/png"
            })
          }
        );

        if (!haResponse.ok) {
          const body = await haResponse.text();
          throw new Error(
            `Home Assistant responded ${haResponse.status}: ${body}`
          );
        }

        res.json({ ok: true, url: imageUrl });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    }
  );

  return router;
}
