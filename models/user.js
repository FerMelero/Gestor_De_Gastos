const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/database');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING, 
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'User', 
  },
);

module.exports = User;
