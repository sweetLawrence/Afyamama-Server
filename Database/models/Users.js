module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true // Ensure unique usernames
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false // Ensure the password is provided
        },
        role: {
            type: DataTypes.ENUM,
            values: ['doctor', 'receptionist', 'lab'], // Define roles for access control
            allowNull: false
        },
        medicalLicenseNumber: {
            type: DataTypes.STRING,
            allowNull: true // Only required for doctors
        },
      
    });

    return Users;
};
