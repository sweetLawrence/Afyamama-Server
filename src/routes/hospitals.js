const express = require("express");
const router = express.Router();
const { Hospitals } = require("../../Database/models");


router.post("/", async (req, res) => {
    console.log("HIT")
    const hospitalBody = req.body
    try {
        const newHospital = await Hospitals.create(hospitalBody);
        return res.status(201).json(newHospital);
    } catch (error) {
        console.error("Error creating hospital:", error);
        return res.status(500).json({ message: "Failed to create hospital" });
    }
});

module.exports = router;
