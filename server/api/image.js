const express = require('express')
const router = express.Router()
const multer = require('multer')
const ms = require('../service/ms')
const upload = multer()

/* GET home page. */
router.post('/upload', upload.single('image'), (req, res) => {
  const result = {
    status: 0,
    data: null,
    message: ''
  }
  ms.detectFace(req.file.buffer, 'buffer').then(response => {
    return ms.identifyFace(JSON.parse(response)[0].faceId)
  }).then(response => {
    return ms.findPerson(response[0].candidates[0].personId)
  }).then(response => {
    result.data = response
    res.json(result)
  })
})

module.exports = router
