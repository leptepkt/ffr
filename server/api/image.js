const express = require('express')
const router = express.Router()
const multer = require('multer')
const request = require('request')
const config = require('../config/config')
const image = require('../service/image')
const upload = multer()

/* GET home page. */
router.post('/upload', upload.single('image'), (req, res) => {
  const result = {
    status: 0,
    data: null,
    message: ''
  }
  image.detectFace(req.file.buffer, 'buffer').then(response => {
    return image.identifyFace(JSON.parse(response)[0].faceId)
  }).then(response => {
    return findPerson(response[0].candidates[0].personId)
  }).then(response => {
    result.data = response
    res.json(result)
  })
})

const findPerson = (personId) => {
  return new Promise(((resolve, reject) => {
    request({
      url: `${config.ms.baseUrl}/persongroups/${config.ms.personGroupId}/persons/${personId}`,
      headers: {
        'Ocp-Apim-Subscription-Key': config.ms.apiKey
      }
    }, (error, response, body) => {
      if (error) {
        reject(error)
      }
      resolve(body)
    })
  }))
}

module.exports = router
