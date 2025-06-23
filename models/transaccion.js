const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Transaccion = sequelize.define('Transaccion', {
  tipo: {
    type: DataTypes.STRING, // 'I' para ingreso o 'G' para gasto
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
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = Transaccion;
