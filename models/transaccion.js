const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const transaccion = sequelize.define('transaccion', {
  tipo: {          
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  importe: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  usuarioId: {      
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = transaccion;