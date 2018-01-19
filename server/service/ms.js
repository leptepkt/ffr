const request = require('request')
const config = require('../config/config')

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

const detectFace = (data, type) => {
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
  return new Promise(((resolve, reject) => {
    request.post(options, (error, response, body) => {
      if (error) {
        reject(error)
      }
      resolve(body)
    })
  }))
}

const identifyFace = (faceId) => {
  const data = {
    'personGroupId': config.ms.personGroupId,
    'faceIds': [faceId],
    'maxNumOfCandidatesReturned': 1,
    'confidenceThreshold': 0.5
  }
  return new Promise((resolve, reject) => {
    request({
      url: `${config.ms.baseUrl}/identify`,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': config.ms.apiKey
      },
      json: data
    }, (error, response, body) => {
      if (error) {
        reject(error)
      }
      resolve(body)
    })
  })
}

module.exports = {
  findPerson: findPerson,
  detectFace: detectFace,
  identifyFace: identifyFace
}