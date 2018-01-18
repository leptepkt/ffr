const config = require('../config/config')
const Jimp = require('jimp')
const request = require('request')

const image = {}

image.isPointInRectangle = (p, r) => {
  const AB = vector(r.A, r.B)
  const AM = vector(r.A, p)
  const BC = vector(r.B, r.C)
  const BM = vector(r.B, p)
  const dotABAM = dot(AB, AM)
  const dotABAB = dot(AB, AB)
  const dotBCBM = dot(BC, BM)
  const dotBCBC = dot(BC, BC)
  return 0 <= dotABAM && dotABAM <= dotABAB && 0 <= dotBCBM && dotBCBM <= dotBCBC
}

const vector = (v1, v2) => {
  return {
    x: (v2.x - v1.x),
    y: (v2.y - v1.y)
  }
}

const dot = (u, v) => {
  return u.x * v.x + u.y * v.y
}

const detectFace = (data, type, cb) => {
  const options = {}
  options.url = `${config.ms.baseUrl}/detect`
  options.body = data
  if (type === 'buffer') {
    options.headers = {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': config.ms.apiKey
    }
  } else {
    options.headers = {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': config.ms.apiKey
    }
  }
  request.post(options, (error, response, body) => {
    if (cb) {
      cb(error, response, body)
    }
  })
}

image.cropUser = (imageUrl) => {
  const data = `{"url": "${imageUrl}"}`
  detectFace(data, 'url', (error, response, body) => {

  })
}

module.exports = image
