const express = require("express");
const router = express.Router();
const { Users } = require("../../Database/models")
const { Hospitals } = require("../../Database/models");

router.post("/", async (req, res) => {
    const { medicalLicenseNumber, hospitalId } = req.body;

    try {

        const user = await Users.findOne({
            where: {
                medicalLicenseNumber,
            }
        });

        const hospital_id = await Hospitals.findOne({
            where: {
                hospitalId,
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        } else if (!hospital_id) {
            return res.status(404).json({ message: "Hospital Not Found" });
        }

        // const { password, ...userData } = user.toJSON();
        return res.status(200).json({ user, hospital_id });
        
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
