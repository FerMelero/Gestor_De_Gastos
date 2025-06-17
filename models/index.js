// ARCHIVO para relacionar tablas

const User = require('./user');
const Transaccion = require('./transaccion');

User.hasMany(Transaccion, { foreignKey: 'usuarioId' });
Transaccion.belongsTo(User, { foreignKey: 'usuarioId' });

module.exports = {User,  Transaccion};
