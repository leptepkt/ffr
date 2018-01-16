const express = require('express')
const router = express.Router()
const multer = require('multer')
const request = require('request')
const config = require('../config/config')

const upload = multer()

/* GET home page. */
router.post('/upload', upload.single('image'), (req, res) => {
  const result = {
    status: 0,
    data: null,
    message: ''
  }
  request.post({
    url: `${config.ms.baseUrl}/detect`,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': config.ms.apiKey
    },
    body: req.file.buffer
  }, (error, response, body) => {
    if (error) {
      result.status = -1
      result.message = error
      res.json(result)
    }
    identify(JSON.parse(body)[0].faceId, (error, response, body) => {
      if (error) {
        result.status = -1
        result.message = error
        res.json(result)
      }
      findPerson(body[0].candidates[0].personId, (error, response, body) => {
        if (error) {
          result.status = -1
          result.message = error
          res.json(result)
        }
        result.data = body
        res.json(result)
      })
    })
  })
})

const identify = (faceId, cb) => {
  const data = {
    'personGroupId': config.ms.personGroupId,
    'faceIds': [faceId],
    'maxNumOfCandidatesReturned': 1,
    'confidenceThreshold': 0.5
  }
  return request({
    url: `${config.ms.baseUrl}/identify`,
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': config.ms.apiKey
    },
    json: data
  }, (error, response, body) => {
    if (cb) {
      cb(error, response, body)
    }
  })
}

const findPerson = (personId, cb) => {
  return request({
    url: `${config.ms.baseUrl}/persongroups/${config.ms.personGroupId}/persons/${personId}`,
    headers: {
      'Ocp-Apim-Subscription-Key': config.ms.apiKey
    }
  }, (error, response, body) => {
    if (cb) {
      cb(error, response, body)
    }
  })
}

module.exports = router
