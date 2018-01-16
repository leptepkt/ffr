const Sequelize = require('sequelize')
const config = require('../config/config')

const sequelize = new Sequelize(config.app.db.databaseName, config.app.db.username, config.app.db.password, {
  host: config.app.db.host,
  dialect: 'postgres',
});

module.exports = sequelize
