const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");

// Get profile
router.get("/", async (req, res) => {
    const profile = await Profile.findOne();
    res.json(profile);
});

// Update / Create profile
router.put("/", async (req, res) => {
    let profile = await Profile.findOne();

    if (!profile) {
        profile = new Profile(req.body);
        await profile.save();
        return res.status(201).json(profile); // ✅ created
    } else {
        Object.assign(profile, req.body);
        await profile.save();
        return res.json(profile); // ✅ updated
    }
});

module.exports = router;