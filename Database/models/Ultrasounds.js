module.exports = (sequelize, DataTypes) => {
    const Ultrasounds = sequelize.define("Ultrasounds", {
        patientId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        trimester: {
            type: DataTypes.STRING,
            allowNull: true
        },
        week: {
            type: DataTypes.STRING,
            allowNull: true
        }

    });


    // Ultrasounds.associate = (models) => {
    //     Ultrasounds.belongsTo(models.Patients, {
    //         foreignKey: 'id',
    //     });
    // };

    return Ultrasounds;
};
