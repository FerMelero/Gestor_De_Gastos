require('dotenv').config(); 
const { Sequelize } = require('sequelize');
const path = require('path');

const storagePath = process.env.DB_PATH || path.join(__dirname, 'dev.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
});

module.exports = sequelize;
