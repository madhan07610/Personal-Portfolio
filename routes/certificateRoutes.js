const express = require("express");
const router  = express.Router();
const Certificate = require("../models/Certificate");

const CACHE_TTL_MS = 60 * 1000;
let certCache = null;
let certCacheAt = 0;

function getCertCache() {
  if (!certCache) return null;
  if (Date.now() - certCacheAt > CACHE_TTL_MS) return null;
  return certCache;
}

function setCertCache(data) {
  certCache = data;
  certCacheAt = Date.now();
}

function clearCertCache() {
  certCache = null;
  certCacheAt = 0;
}

// GET all
router.get("/", async (req, res) => {
  try {
    const cached = getCertCache();
    if (cached) return res.json(cached);
    const data = await Certificate.find().lean();
    setCertCache(data);
    res.json(data);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// POST single
router.post("/", async (req, res) => {
  try {
    const cert = new Certificate(req.body);
    await cert.save();
    clearCertCache();
    res.status(201).json(cert); // ✅ only change
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// PUT / — bulk replace (used by admin dashboard)
router.put("/", async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : [];
    await Certificate.deleteMany({});
    const inserted = items.length > 0 ? await Certificate.insertMany(items) : [];
    clearCertCache();
    res.json(inserted);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// PUT /:id — update single
router.put("/:id", async (req, res) => {
  try {
    const updated = await Certificate.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    clearCertCache();
    res.json(updated);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// DELETE /:id
router.delete("/:id", async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    clearCertCache();
    res.json({ success: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;