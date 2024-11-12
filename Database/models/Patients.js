const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Patients = sequelize.define("Patients", {
        id:{
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: () => generatePatientId()
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false, // Date of registration is mandatory
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false, // Time of registration is mandatory
        },
        national_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensure unique national IDs
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false, // First name is mandatory
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false, // Last name is mandatory
        },
        sex: {
            type: DataTypes.ENUM,
            values: ['Male', 'Female', 'Other'],
            allowNull: false,
            defaultValue: 'Female', // Default value
        },
        date_of_birth: {
            type: DataTypes.DATE,
            allowNull: false, // Date of birth is mandatory
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true, // Phone number is optional
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true, // Ensure valid email format
            },
        },
        marital_status: {
            type: DataTypes.STRING,
            allowNull: true, // Marital status is optional
        },
        emergency_first_name: {
            type: DataTypes.STRING,
            allowNull: true, // Emergency contact first name is optional
        },
        emergency_last_name: {
            type: DataTypes.STRING,
            allowNull: true, // Emergency contact last name is optional
        },
        emergency_relationship: {
            type: DataTypes.STRING,
            allowNull: true, // Emergency contact relationship is optional
        },
        emergency_phone: {
            type: DataTypes.STRING,
            allowNull: true, // Emergency contact phone is optional
        },
        lmp: {
            type: DataTypes.DATE, // Last Menstrual Period
            allowNull: true,
        },
        gravida: {
            type: DataTypes.INTEGER, // Number of times pregnant
            allowNull: true,
        },
        parity: {
            type: DataTypes.INTEGER, // Number of pregnancies carried to a viable gestational age
            allowNull: true,
        },
        hospitalId: {
            type: DataTypes.STRING,
            allowNull: true, // Optional until admitted
        },
        status: {
            type: DataTypes.ENUM,
            values: ['registered', 'admitted', 'in_lab', 'returned_to_doctor', 'discharged'], // Track patient status
            allowNull: false,
            defaultValue: 'registered', // Default status on registration
        },
        nextAppointmentDate: {
            type: DataTypes.DATE,
            allowNull: true, // Optional, for scheduling the next appointment
        },

    });

    function generatePatientId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < 6; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }


    Patients.associate = (models) => {
        Patients.hasMany(models.AdmittedPatients, {
            foreignKey: 'patientId',
            onDelete: 'CASCADE'
        });
        Patients.hasMany(models.Ultrasounds, {
            foreignKey: 'patientId',
            onDelete: 'CASCADE'
        });
    };

    return Patients;
};
