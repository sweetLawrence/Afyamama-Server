module.exports = (sequelize, DataTypes) => {
    const AdmittedPatients = sequelize.define("AdmittedPatients", {
        patientId: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        hospitalId: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        admissionDate: {
            type: DataTypes.STRING,
            allowNull: false // Ensure the admission date is provided
        },
        dischargeDate: {
            type: DataTypes.STRING,
            allowNull: true // Discharge date is optional initially
        },
        // status: {
        //     type: DataTypes.ENUM,
        //     values: ['admitted', 'discharged'], // Define status options
        //     allowNull: false
        // },
        status: {
            type: DataTypes.ENUM('in_hospital', 'under_doctor', 'in_lab'), // Updated status options
            allowNull: false,
            defaultValue: 'in_hospital' // Default status when admitted
        },
        receptionStaffId: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        visitId:{
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        }

    });

    AdmittedPatients.associate = (models) => {
        // An admitted patient belongs to one patient
        AdmittedPatients.belongsTo(models.Patients, {
            foreignKey: 'patientId',
            onDelete: 'CASCADE'
        });
    }
    return AdmittedPatients;
};
