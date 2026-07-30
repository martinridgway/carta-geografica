import express from "express";
import multer from "multer";
import { mkdir, rm } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { extname, join } from "node:path";

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const SAFE_ID = /^[a-zA-Z0-9-]+$/;
const SAFE_FILENAME = /^[a-zA-Z0-9-]+\.(jpg|jpeg|png|webp|gif)$/i;

function validateId(req, res, next, value) {
  if (!SAFE_ID.test(value)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  next();
}

export function createPhotosRouter(uploadsDir) {
  const router = express.Router();

  router.param("locationId", validateId);
  router.param("visitId", validateId);
  router.param("filename", (req, res, next, value) => {
    if (!SAFE_FILENAME.test(value)) {
      res.status(400).json({ error: "Invalid filename" });
      return;
    }
    next();
  });

  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const dir = join(uploadsDir, req.params.locationId, req.params.visitId);

      try {
        await mkdir(dir, { recursive: true });
        cb(null, dir);
      } catch (err) {
        cb(err);
      }
    },
    filename: (req, file, cb) => {
      cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`);
    }
  });

  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024, files: 10 },
    fileFilter: (req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase();

      if (!file.mimetype.startsWith("image/") || !ALLOWED_EXTENSIONS.has(ext)) {
        cb(new Error("Only image files are allowed"));
        return;
      }

      cb(null, true);
    }
  });

  router.post("/:locationId/:visitId", (req, res) => {
    upload.array("photos", 10)(req, res, err => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      if (!req.files?.length) {
        res.status(400).json({ error: "No photos received" });
        return;
      }

      const urls = req.files.map(
        file =>
          `/uploads/${req.params.locationId}/${req.params.visitId}/${file.filename}`
      );

      res.json({ urls });
    });
  });

  router.delete("/:locationId/:visitId/:filename", async (req, res) => {
    const { locationId, visitId, filename } = req.params;
    const filePath = join(uploadsDir, locationId, visitId, filename);

    try {
      await rm(filePath);
      res.json({ ok: true });
    } catch (err) {
      if (err.code === "ENOENT") {
        res.status(404).json({ error: "Photo not found" });
        return;
      }

      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
