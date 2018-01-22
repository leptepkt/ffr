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
    User.findById(userRequest.id).then(user => {
      if (user) { // User existed -> Update access token
        //TODO: update token
        result.message = 'existed'
        res.json(result)
      } else {
        ms.createPerson(userRequest.name, userRequest.id).then(response => {
          User.create({
            id: userRequest.id,
            name: userRequest.name,
            email: userRequest.email,
            accessToken: userRequest.accessToken,
            status: 0,
            msId: JSON.parse(response).personId
          }).then(createdUser => {
            queue.addJob(createdUser)
            result.message = 'created'
            res.json(result)
          })
        }).catch(error => {
          console.log(error)
          result.status = -1
          res.json(result)
        })
      }
    })
  })
})

module.exports = router
