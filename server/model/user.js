const sequelize = require('../config/sequelize')
const Sequelize = require('sequelize')

const User = sequelize.define('users', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  accessToken: {
    type: Sequelize.STRING,
    field: 'access_token'
  },
  status: Sequelize.INTEGER,
  msId: {
    type: Sequelize.STRING,
    field: 'ms_id'
  }
})

User.sync()

module.exports = User
