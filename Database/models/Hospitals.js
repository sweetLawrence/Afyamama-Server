module.exports = (sequelize, DataTypes) => {
    const Hospitals = sequelize.define("Hospitals", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true // Ensure unique hospital names
        },
        hospitalId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true // Ensure unique hospital IDs
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false // Hospital must have an address
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true // Phone number can be optional
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true, // Email can also be optional
            validate: {
                isEmail: true // Ensure valid email format
            }
        },
       
    });

    return Hospitals;
};
