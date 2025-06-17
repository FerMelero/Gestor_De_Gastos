const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Transaccion = sequelize.define('Transaccion', {
  tipo: {
    type: DataTypes.STRING, // 'ingreso' o 'gasto'
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
    defaultValue: DataTypes.NOW
  }
});

module.exports = Transaccion;
