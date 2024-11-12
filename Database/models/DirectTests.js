// models/DirectTest.js

module.exports = (sequelize, DataTypes) => {
    const DirectTests = sequelize.define('DirectTests', {
      patientId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      testName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      testCategory: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      result: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      comment: {
        type: DataTypes.STRING,
      },
      doctorId: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      testDate:{
        type: DataTypes.STRING,
        allowNull: false,
      },

      trimester:{
        type: DataTypes.STRING,
        allowNull: false,
      },

      visitId:{
        type: DataTypes.STRING,
        allowNull: false,
      }

    });
  
    DirectTests.associate = (models) => {
      DirectTests.belongsTo(models.Patients, {
        foreignKey: 'patientId',
        as: 'patient',
      });

    //   DirectTests.belongsTo(models.Users, {
    //     foreignKey: 'doctorId',
    //     as: 'doctor',
    //   });
      
    };
  
    return DirectTests;
  };
  