const request = require('request')
const config = require('../config/config')

const fb = {}

fb.getLongLivedToken = (accessToken, cb) => {
  const url = `${config.fb.baseUrl}/oauth/access_token?grant_type=fb_exchange_token&client_id=${config.fb.appId}&client_secret=${config.fb.appSecret}&fb_exchange_token=${accessToken}`
  request({
    url: url,
  }, (error, response, body) => {
    if (cb) {
      cb(error, response, body)
    }
  })
}

module.exports = fb

