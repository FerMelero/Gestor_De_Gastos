const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/database');

class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
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

console.log(User === sequelize.models.User); 

module.exports = User;
