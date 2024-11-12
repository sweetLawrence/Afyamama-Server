// // routes/directTest.js

// const express = require('express');
// const router = express.Router();
// const { DirectTests} = require("../../Database/models")

// // Route to save direct test results
// router.patch('/direct-tests', async (req, res) => {
//   const { patientId, doctorId, result,testName, comment, testCategory} = req.body;
//   console.log(req.body);

//   try {
//     // Save all test results
//     // const testRecords = await Promise.all(
//     //   tests.map((test) =>
//         DirectTests.create({
//           patientId,
//           doctorId,
//           testName,
//           testCategory,
//           result,
//           comment: comment || '',
//         })
//     //   )
//     // );

//     res.status(201).json({ message: 'Direct test results saved successfully.', testRecords });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to save test results.' });
//   }
// });

// module.exports = router;




// routes/directTests.js

// const express = require('express');
// const router = express.Router();
// const { DirectTests } = require('../../Database/models');

// // Route to update direct test results
// router.patch('/direct-tests', async (req, res) => {
//     const { patient_id, doctorId, ...testData } = req.body; // Extract patient_id and doctorId from request body

//     const testRecords = []; // Array to hold the structured test records

//     // Loop through each key in testData
//     for (const key in testData) {
//         if (key.endsWith('_comment')) {
//             // Extract the base test name by removing the '_comment' part
//             const testName = key.replace('_comment', '');

//             // Check if the result for this test exists in testData
//             if (testData[testName]) {
//                 testRecords.push({
//                     patientId: patient_id, // Use patient_id from request body
//                     doctorId,
//                     testName,
//                     testCategory: 'Vital Signs', // Update this based on your category logic
//                     result: testData[testName],
//                     comment: testData[key] || '', // Assign comment if available
//                 });
//             }
//         }
//     }

//     try {
//         // Save all test results to the database
//         await DirectTests.bulkCreate(testRecords);
//         res.status(200).json({ message: 'Direct test results updated successfully.', testRecords });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to update test results.' });
//     }
// });

// module.exports = router;





// *888888888********************
// const express = require('express');
// const router = express.Router();
// const { DirectTests } = require('../../Database/models');

// // Route to update direct test results
// router.patch('/direct-tests', async (req, res) => {
//     const { patient_id, doctorId, trimester, testDate, visitId, ...testData } = req.body; // Extract patient_id and doctorId from request body

//     // Array to hold the structured test records
//     const testRecords = [];

//     // Loop through each key in testData
//     for (const key in testData) {
//         if (key.endsWith('_comment')) {
//             // Extract the base test name by removing the '_comment' part
//             const testName = key.replace('_comment', '');

//             // Check if the result for this test exists in testData
//             if (testData[testName]) {
//                 testRecords.push({
//                     patientId: patient_id, // Use patient_id from request body
//                     doctorId,
//                     visitId,
//                     testName,
//                     trimester,
//                     testDate,
//                     testCategory: 'Vital Signs', // Update this based on your category logic
//                     result: testData[testName],
//                     comment: testData[key] || '', // Assign comment if available
//                 });
//             }
//         }
//     }

//     try {
//         // Loop through the structured test records
//         for (const testRecord of testRecords) {
//             // Find an existing record by patientId and testName
//             const existingRecord = await DirectTests.findOne({
//                 where: {
//                     patientId: testRecord.patientId,
//                     testName: testRecord.testName,
//                     visitId: testRecord.visitId,
//                     testCategory: testRecord.testCategory, // Include testCategory in the search
//                 },
//             });

//             if (existingRecord) {
//                 // Update existing record
//                 await existingRecord.update({
//                     result: testRecord.result,
//                     comment: testRecord.comment,
//                 });
//             } else {
//                 // Create a new record
//                 await DirectTests.create(testRecord);
//             }
//         }

//         res.status(200).json({ message: 'Direct test results updated successfully.', testRecords });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to update test results.' });
//     }
// });

// module.exports = router;

// *888888888********************

// 99999999999999999999999999
const express = require('express');
const router = express.Router();
const { DirectTests, AdmittedPatients, LabTests } = require('../../Database/models'); // Make sure to import AdmittedPatients

// Route to update direct test results
const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

router.patch('/direct-tests', async (req, res) => {
    console.log("HIT")
    const { patient_id, doctorId, trimester, testDate, ...testData } = req.body; // Extract patient_id and doctorId from request body

    try {
        // Get the current date
        const currentDate = new Date();
        const formattedCurrentDate = formatDateToYYYYMMDD(currentDate)  // Format date as YYYY-MM-DD
        console.log(formattedCurrentDate)
        // console.log(currentDate)
        // Find the visitId from the admittedpatients table where the admission date is today
        const admittedPatient = await AdmittedPatients.findOne({
            where: {
                patientId: patient_id,
                // admissionDate: formattedCurrentDate, // Ensure this matches your date format in the DB
            },
        });

        if (!admittedPatient) {
            console.log("NO Match")
            return res.status(404).json({ message: 'No admission record found for today.' });
        }

        const visitId = admittedPatient.visitId; // Get the visitId
        console.log("VisitId", visitId)

        // Array to hold the structured test records
        const testRecords = [];

        // Loop through each key in testData
        for (const key in testData) {
            if (key.endsWith('_comment')) {
                // Extract the base test name by removing the '_comment' part
                const testName = key.replace('_comment', '');

                // Check if the result for this test exists in testData
                if (testData[testName]) {
                    testRecords.push({
                        patientId: patient_id, // Use patient_id from request body
                        doctorId,
                        visitId, // Use the retrieved visitId
                        testName,
                        trimester,
                        testDate,
                        testCategory: 'Vital Signs', // Update this based on your category logic
                        result: testData[testName],
                        comment: testData[key] || '', // Assign comment if available
                    });
                }
            }
        }

        // Loop through the structured test records
        for (const testRecord of testRecords) {
            // Find an existing record by patientId, testName, and visitId
            const existingRecord = await DirectTests.findOne({
                where: {
                    patientId: testRecord.patientId,
                    testName: testRecord.testName,
                    visitId: testRecord.visitId,
                    testCategory: testRecord.testCategory, // Include testCategory in the search
                },
            });

            if (existingRecord) {
                // Update existing record
                await existingRecord.update({
                    result: testRecord.result,
                    comment: testRecord.comment,
                });
            } else {
                // Create a new record
                await DirectTests.create(testRecord);
            }
        }

        res.status(200).json({ message: 'Direct test results updated successfully.', testRecords });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update test results.' });
    }
});





// router.patch('/lab-tests', async (req, res) => {
//     console.log("LAB HIT")
//     const { patientId, doctorId, trimester, testDate, ...testData } = req.body; // Extract patient_id and doctorId from request body

//     try {
//         // Get the current date
//         const currentDate = new Date();
//         const formattedCurrentDate = formatDateToYYYYMMDD(currentDate)  // Format date as YYYY-MM-DD
//         console.log(formattedCurrentDate)
//         // console.log(currentDate)
//         // Find the visitId from the admittedpatients table where the admission date is today
//         const admittedPatient = await AdmittedPatients.findOne({
//             where: {
//                 patientId,
//                 admissionDate: formattedCurrentDate, // Ensure this matches your date format in the DB
//             },
//         });

//         if (!admittedPatient) {
//             console.log("NO Match")
//             return res.status(404).json({ message: 'No admission record found for today.' });
//         }

//         const visitId = admittedPatient.visitId; // Get the visitId
//         console.log("VisitId", visitId)

//         // Array to hold the structured test records
//         const testRecords = [];

//         // Loop through each key in testData
//         for (const key in testData) {
//             if (key.endsWith('_comment')) {
//                 // Extract the base test name by removing the '_comment' part
//                 const testName = key.replace('_comment', '');

//                 // Check if the result for this test exists in testData
//                 if (testData[testName]) {
//                     testRecords.push({
//                         patientId: patient_id, // Use patient_id from request body
//                         doctorId,
//                         visitId, // Use the retrieved visitId
//                         testName,
//                         trimester,
//                         testDate,
//                         testCategory: 'Vital Signs', // Update this based on your category logic
//                         result: testData[testName],
//                         comment: testData[key] || '', // Assign comment if available
//                     });
//                 }
//             }
//         }

//         // Loop through the structured test records
//         for (const testRecord of testRecords) {
//             // Find an existing record by patientId, testName, and visitId
//             const existingRecord = await LabTests.findOne({
//                 where: {
//                     patientId: testRecord.patientId,
//                     testName: testRecord.testName,
//                     visitId: testRecord.visitId,
//                     testCategory: testRecord.testCategory, // Include testCategory in the search
//                 },
//             });

//             if (existingRecord) {
//                 // Update existing record
//                 await existingRecord.update({
//                     result: testRecord.result,
//                     comment: testRecord.comment,
//                 });
//             } else {
//                 // Create a new record
//                 await LabTests.create(testRecord);
//             }
//         }

//         res.status(200).json({ message: 'Lab results updated successfully.', testRecords });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to update lab test results.' });
//     }
// });
// module.exports = router;
router.patch('/lab-tests', async (req, res) => {
    console.log("LAB HIT");
    console.log(req.body)
    const { patientId, doctorId, trimester, testDate,testCategory, ...testData } = req.body; // Extract patientId, doctorId, trimester, and testDate from request body

    try {
        // Get the current date
        const currentDate = new Date();
        const formattedCurrentDate = formatDateToYYYYMMDD(currentDate); // Format date as YYYY-MM-DD
        console.log(formattedCurrentDate);

        // Find the visitId from the admittedpatients table where the admission date is today
        const admittedPatient = await AdmittedPatients.findOne({
            where: {
                patientId,
                // admissionDate: "2024-10-22",
                // admissionDate: formattedCurrentDate,
                // Ensure this matches your date format in the DB
            },
        });

        if (!admittedPatient) {
            console.log("NO Match");
            return res.status(404).json({ message: 'No admission record found for today.' });
        }

        const visitId = admittedPatient.visitId; // Get the visitId
        console.log("VisitId", visitId);

        // Array to hold the structured test records
        const testRecords = [];

        // Loop through each key in testData
        for (const testName in testData) {
            // Only include tests that have a result (non-empty values)
            if (testData[testName]) {
                testRecords.push({
                    patientId, // Use patientId from request body
                    doctorId,
                    visitId, // Use the retrieved visitId
                    testName, // The test name comes from the key
                    trimester,
                    testDate,
                    testCategory, // Use "X" for all test categories
                    result: testData[testName], // The result comes from the value
                    comment: '', // No comment
                });
            }
        }

        // Loop through the structured test records
        for (const testRecord of testRecords) {
            // Find an existing record by patientId, testName, and visitId
            const existingRecord = await LabTests.findOne({
                where: {
                    patientId: testRecord.patientId,
                    testName: testRecord.testName,
                    visitId: testRecord.visitId,
                    testDate: testRecord.testDate,
                    testCategory: testRecord.testCategory, // Include testCategory in the search
                },
            });

            if (existingRecord) {
                // Update existing record
                await existingRecord.update({
                    result: testRecord.result,
                    comment: testRecord.comment,
                });
            } else {
                // Create a new record
                await LabTests.create(testRecord);
            }
        }

        res.status(200).json({ message: 'Lab results updated successfully.', testRecords });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update lab test results.' });
    }
});
module.exports = router;

// 99999999999999999999999






// const express = require('express');
// const router = express.Router();
// const { DirectTests } = require('../../Database/models');

// // Route to update direct test results
// router.patch('/direct-tests/:patientId', async (req, res) => {

// // router.get('/direct-tests', async (req, res) => {
//     console.log("HITT")
//     const { patientId } = req.params; // Get patientId from URL
//     const { doctorId, ...testCategories } = req.body; // Extract doctorId and test categories (dynamic)

//     try {
//         // Loop through each test category (e.g., vital_signs, general_exam)
//         for (const testCategory in testCategories) {
//             const tests = testCategories[testCategory];

//             // Loop through each test in the category and update the corresponding record in the DB
//             for (const testName in tests) {
//                 const { result, comment } = tests[testName];

//                 // Find the test record by patientId, testCategory, and testName
//                 const testRecord = await DirectTests.findOne({
//                     where: {
//                         patientId,
//                         testCategory,
//                         testName,
//                     },
//                 });

//                 // If the test exists, update it; if not, create a new record
//                 if (testRecord) {
//                     await testRecord.update({
//                         result,
//                         comment: comment || '',
//                     });
//                 } else {
//                     // Create a new test entry if it doesn't exist
//                     await DirectTests.create({
//                         patientId,
//                         doctorId,
//                         testCategory,
//                         testName,
//                         result,
//                         comment: comment || '',
//                     });
//                 }
//             }
//         }

//         res.status(200).json({ message: 'Direct test results updated successfully.' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to update test results.' });
//     }
// });

// module.exports = router;
