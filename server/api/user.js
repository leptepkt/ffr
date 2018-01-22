const express = require('express')
const router = express.Router()
const User = require('../model/user')
const fbService = require('../service/facebook')
const ms = require('../service/ms')
const queue = require('../service/queue')

router.post('/', (req, res) => {
  const result = {
    status: 0,
    data: null,
    message: ''
  }
  const userRequest = req.body
  fbService.getLongLivedToken(userRequest.accessToken).then(response => {
    userRequest.accessToken = JSON.parse(response).access_token
    User.findOrCreate({
      where: {id: userRequest.id},
      defaults: {
        name: userRequest.name,
        email: userRequest.email,
        accessToken: userRequest.accessToken,
        status: 0,
      }
    }).spread((user, created) => {
      if (created) {
        result.message = 'created'
        ms.createPerson(userRequest.name, userRequest.id).then(response => {
          queue.addJob(userRequest)
        })
      } else {
        result.message = 'existed'
      }
      res.json(result)
    })
  })
})

module.exports = router
