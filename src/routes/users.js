const express = require("express");
const router = express.Router();
const { Users } = require("../../Database/models")

router.post("/", async (req, res) => {
    const userBody = req.body
    try {
        const newUser = await Users.create(userBody);
        return res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Failed to create user" });
    }
});

module.exports = router;
