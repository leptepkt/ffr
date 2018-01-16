const express = require('express')
const router = express.Router()
const User = require('../model/user')

router.post('/', (req, res) => {
  const result = {
    status: 0,
    data: null,
    message: ''
  }
  const user = req.body
  User.findOrCreate({
    where: {id: user.id},
    defaults: {
      name: user.name,
      email: user.email,
      accessToken: user.accessToken,
      status: 0,
    }
  }).spread((user, created) => {
    if (created) {
      result.message = 'created'
    } else {
      result.message = 'existed'
    }
    res.json(result)
  })
})

module.exports = router
