// patientRoutes.js
const express = require('express');
const router = express.Router();
const { Patients, AdmittedPatients, DirectTests, LabTests, Ultrasounds } = require("../../Database/models");
const { where } = require('sequelize');


// Route to register a new patient
router.post('/register', async (req, res) => {
    try {
        // Create a new patient

        const patientData = req.body
        const newPatient = await Patients.create(patientData);

        // Send back the created patient
        return res.status(201).json({
            message: 'Patient registered successfully!',
            patient: newPatient,
        });
    } catch (error) {
        console.error("Error registering patient:", error);
        return res.status(500).json({ message: 'An error occurred while registering the patient.', error });
    }
});


router.get("/check/:nationalId", async (req, res) => {
    console.log(req.body)
    const { nationalId } = req.params;

    try {
        const patient = await Patients.findOne({
            where: {
                national_id: nationalId,
            },
        });

        if (patient) {
            return res.status(200).json({ exists: true, patient });
        } else {
            return res.status(404).json({ exists: false, message: "Patient not found." });
        }
    } catch (error) {
        console.error("Error fetching patient:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

router.post("/admit-patient", async (req, res) => {

    const { patientId, receptionStaffId, hospitalId, admissionDate } = req.body;

    try {

        function generateVisitId(hospitalId, patientId) {
            // Get the current year
            const year = new Date().getFullYear();

            // Generate a random 4-character string
            const randomChars = Math.random().toString(36).substring(2, 6); // Generates a random string

            // Format the visitId
            const visitId = `${year}-${hospitalId}-${patientId}-${randomChars}`;

            return visitId;
        }


        const visitId = generateVisitId(hospitalId, patientId);

        const existingAdmission = await AdmittedPatients.findOne({
            where: {
                patientId,
                // status: 'admitted' // Only check for currently admitted patients
            }
        });

        if (existingAdmission) {
            return res.status(400).json({ message: 'Patient is already admitted in another hospital.' });
        }

        // Check if the patient exists
        const patient = await Patients.findByPk(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Admit the patient
        const admittedPatient = await AdmittedPatients.create({
            patientId: patient.id,
            receptionStaffId: receptionStaffId,
            admissionDate,
            hospitalId: hospitalId,
            // status:"admitted",
            visitId
        });

        res.status(201).json({
            message: "Patient admitted successfully",
            admission_time: admittedPatient.admission_time,
            admission_date: admittedPatient.admission_date,
            visitId: visitId
        });
    } catch (error) {
        console.error("Error admitting patient:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/admitted-patients/:hospitalId', async (req, res) => {
    const { hospitalId } = req.params; // Get the hospitalId from request parameters

    try {
        // Fetch all admitted patients for the given hospitalId
        const admittedPatients = await AdmittedPatients.findAll({
            where: { hospitalId }, // Filter by hospitalId
            attributes: ['patientId'] // Only get patientId for the next query
        });

        // Check if any admitted patients were found
        if (!admittedPatients.length) {
            return res.status(404).json({ message: 'No admitted patients found for this hospital.' });
        }

        // Extract patientIds
        const patientIds = admittedPatients.map(admitted => admitted.patientId);


        // Fetch patient details for the extracted patientIds
        const patients = await Patients.findAll({
            where: {
                id: patientIds // Filter by the list of patientIds
            },
            // attributes: ['first_name', 'last_name', 'national_id', 'date_of_birth'] // Select required fields
        });

        // Check if patients were found
        if (!patients.length) {
            return res.status(404).json({ message: 'No patient details found for admitted patients.' });
        }

        // Map the results to a simpler format
        // const results = patients.map(patient => ({
        //     nationalId: patient.national_id,
        //     firstName: patient.first_name,
        //     lastName: patient.last_name,
        //     dateOfBirth: patient.date_of_birth
        // }));

        // Send the results as response
        res.status(200).json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching admitted patients.' });
    }
});

// appointments 

router.patch('/appointments', async (req, res) => {
    const { patientId, appointmentDate } = req.body;

    try {
        // Find the patient by ID
        const patient = await Patients.findOne({
            where: {
                id: patientId
            },
        });

        // If the patient exists, update the appointment date
        if (patient) {
            await Patients.update(
                { nextAppointmentDate: appointmentDate }, // Data to update
                { where: { id: patientId } } // Condition to find the specific patient
            );

            res.status(200).json("success");
        } else {
            // If patient does not exist, return a 404 error
            res.status(404).json("Patient not found");
        }
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(400).json("error");
    }
});


// Ultrasounds
router.post('/ultrasound', async (req, res) => {
    // const { patientId, trime } = req.body;

    try {
        const ultrasound_details = req.body;
        console.log(ultrasound_details);

        const patient = Patients.findOne({
            where: { id: ultrasound_details.patientId }
        })

        if (!patient) console.log("Patient Not Found");
        const fill_table = await Ultrasounds.create(ultrasound_details)
        console.log(fill_table);
        res.status(200).json("success");
    }


    catch (error) {
        console.error("Error updating appointment:", error);
        res.status(400).json("error");
    }
});



// send to lab

router.patch('/send-to-lab', async (req, res) => {
    const { patientId } = req.body; // Get the patientId from the request body

    try {
        // Update the patient's status in the AdmittedPatients table
        // const patient = await AdmittedPatients.findOne({ where: { patientId } });
        const patient = await Patients.findOne({ where: { id: patientId } });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        // Update the status to 'in_lab'
        await patient.update({ status: 'in_lab' });

        res.status(200).json({ message: 'Patient sent to lab successfully.', status: 'in_lab' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send patient to lab.' });
    }
});


// router.get('/lab', async (req, res) => {
//     try {
//         const labPatients = await AdmittedPatients.findAll({
//             where: { status: 'in_lab' },
//             include: [/* Include related models if needed */],
//         });

//         res.status(200).json(labPatients);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to retrieve lab patients.' });
//     }
// });

// Example Express route to fetch patients in lab
// router.get('/lab/:hospitalId', async (req, res) => {
//     console.log("HIT");
//     try {
//       const { hospitalId } = req.params;
//       const patientsInLab = await AdmittedPatients.findAll({
//         where: {
//           hospitalId: hospitalId,
//           status: 'in_lab', // Adjust according to your status logic
//         },
//         include: [/* Include any related models if necessary */]
//       });

//       res.status(200).json(patientsInLab);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Failed to fetch patients in lab.' });
//     }
//   });

// router.get('/lab/:hospitalId', async (req, res) => {
//     const { hospitalId } = req.params; // Get the hospitalId from request parameters

//     try {
//         // Fetch all admitted patients who are currently in the lab for the given hospitalId

//         // const labPatients = await AdmittedPatients.findAll({
//             const labPatients = await Patients.findAll({
//             where: {
//                 hospitalId, // Filter by hospitalId
//                 status: 'in_lab' // Ensure the status indicates the patient is in the lab
//             },
//             attributes: ['patientId'] // Only get patientId for the next query
//         });

//         // Check if any lab patients were found
//         if (!labPatients.length) {
//             return res.status(404).json({ message: 'No patients currently in the lab for this hospital.' });
//         }

//         // Extract patientIds
//         // const patientIds = labPatients.map(patient => patient.patientId);
//         const patientIds = labPatients.map(patient => patient.id);

//         // Fetch patient details for the extracted patientIds
//         const patients = await Patients.findAll({
//             where: {
//                 id: patientIds // Filter by the list of patientIds
//             },
//         });

//         // Check if patient details were found
//         if (!patients.length) {
//             return res.status(404).json({ message: 'No patient details found for lab patients.' });
//         }

//         // Map the results to a simpler format
//         // const results = patients.map(patient => ({
//         //     nationalId: patient.national_id,
//         //     firstName: patient.first_name,
//         //     lastName: patient.last_name,
//         //     dateOfBirth: patient.date_of_birth
//         // }));

//         // Send the results as response
//         res.status(200).json(patients); // Return the mapped results
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while fetching lab patients.' });
//     }
// });


// router.get('/lab/:hospitalId', async (req, res) => {
//     const { hospitalId } = req.params; // Get the hospitalId from request parameters

//     try {
//         // Fetch all patients who are currently in the lab for the given hospitalId
//         // const labPatients = await AdmittedPatients.findAll({
//             const labPatients = await Patients.findAll({
//             where: {
//                 hospitalId, // Filter by hospitalId
//                 status: 'in_lab' // Ensure the status indicates the patient is in the lab
//             },
//             // attributes: ['status']
//             attributes: ['id', 'national_id', 'first_name', 'last_name', 'date_of_birth','lmp'] // Select relevant patient fields
//         });

//         // Check if any lab patients were found
//         if (!labPatients.length) {
//             return res.status(404).json({ message: 'No patients currently in the lab for this hospital.' });
//         }

//         // Send the results as response
//         res.status(200).json(labPatients); // Return the list of lab patients
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while fetching lab patients.' });
//     }
// });


// EXPERIMENTAL
router.get('/lab/:hospitalId', async (req, res) => {
    const { hospitalId } = req.params; // Get the hospitalId from request parameters

    try {
        // Fetch patients who are in_lab status and are admitted in the given hospital
        const labPatients = await Patients.findAll({
            include: [{
                model: AdmittedPatients, // Assuming AdmittedPatients is the related model
                where: {
                    hospitalId, // Filter by hospitalId from AdmittedPatients table
                }
            }],
            where: {
                status: 'in_lab' // Ensure the patient status is 'in_lab'
            },
            attributes: ['id', 'national_id', 'first_name', 'last_name', 'date_of_birth', 'lmp'] // Select relevant patient fields
        });

        // Check if any lab patients were found
        if (!labPatients.length) {
            return res.status(404).json({ message: 'No patients currently in the lab for this hospital.' });
        }

        // Send the results as response
        res.status(200).json(labPatients); // Return the list of lab patients
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching lab patients.' });
    }
});

// EXPERIMENTAL



router.get('/history/:patientId', async (req, res) => {
    const { patientId } = req.params;
    console.log("HIT")

    try {
        // Fetch only the relevant fields from DirectTests table
        const directTests = await DirectTests.findAll({
            where: { patientId },
            attributes: [
                'testName',
                'testCategory',
                'result',
                'comment',
                'doctorId',
                'testDate',
                'trimester',
                'visitId'
            ], // Fetch only these fields
        });

        // Fetch only the relevant fields from LabTests table
        const labTests = await LabTests.findAll({
            where: { patientId },
            attributes: [
                'testName',
                'testCategory',
                'result',
                'comment',
                'doctorId',
                'testDate',
                'trimester',
                'visitId'
            ], // Fetch only these fields
        });

        // Merge the results from both DirectTests and LabTests
        const allTests = [...directTests, ...labTests].sort((a, b) => new Date(b.testDate) - new Date(a.testDate));

        const ultrasound_url = Ultrasounds.findAll({
            where: { patientId },
            attributes: ['url']
        })
        res.status(200).json(allTests);
        //   console.log("yyy",labTests)
        //   console.log("xxx",directTests)
        //   console.log("zzz",allTests)


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch patient history' });
    }
});

// Ultrasound fetching
router.get('/ultrasound/:patientId', async (req, res) => {
    const { patientId } = req.params;
    console.log("Ultra Hit")

    try {
        const ultrasound = await Ultrasounds.findAll({
            where: { patientId },
            attributes: [
                'date',
                'url',
                'trimester',
                'week'
            ]
        })

        const ultrasound_imgs = [...ultrasound].sort((a, b) => new Date(b.date) - new Date(a.date));
        res.status(200).json(ultrasound_imgs);
        // console.log(ultrasound);
        // res.json(ultrasound);

    } catch (error) {

    }
})







// Assuming you're using Express and your Patients model is imported
router.put('/clear/:patientId', async (req, res) => {
    const { patientId } = req.params;

    try {
        // Update the patient's status to 'registered'
        // const updatedPatient = await AdmittedPatients.update(
        const updatedPatient = await Patients.update(
            { status: 'registered' },
            { where: { id: patientId } }
        );

        // Check if the patient was updated
        if (updatedPatient[0] === 0) {
            return res.status(404).json({ message: 'Patient not found or status already registered.' });
        }

        res.status(200).json({ message: 'Patient cleared from lab successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while clearing the patient from the lab.' });
    }
});



router.delete('/discharge/:patientId', async (req, res) => {
    const { patientId } = req.params;

    try {
        // Find the admitted patient by patientId
        const patient = await AdmittedPatients.findOne({
            where: { patientId }
        });
        const patientStatus = await Patients.findOne({
            where: { id: patientId }
        });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        // Delete the patient record
        await AdmittedPatients.destroy({
            where: { patientId }
        });
        await patientStatus.update({ status: 'registered' });

        return res.status(200).json({ message: 'Patient discharged successfully.' });
    } catch (error) {
        console.error('Error discharging patient:', error);
        return res.status(500).json({ message: 'Error discharging patient.' });
    }
});





module.exports = router;
