const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// GET
router.get("/", async (req, res) => {
  res.json(await Project.find());
});

// POST
router.post("/", async (req, res) => {
  const item = new Project(req.body);
  await item.save();
  res.json(item);
});

// PUT (update)
router.put("/:id", async (req, res) => {
  const updated = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: "after" }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;