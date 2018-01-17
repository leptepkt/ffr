const express = require('express')
const router = express.Router()
const User = require('../model/user')
const fbService = require('../service/facebook')

router.post('/', (req, res) => {
  const result = {
    status: 0,
    data: null,
    message: ''
  }
  const user = req.body
  fbService.getLongLivedToken(user.accessToken, (error, response, body) => {
    if (!error) {
      user.accessToken = JSON.parse(body).access_token
    }
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
})

module.exports = router
