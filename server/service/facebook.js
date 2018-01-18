const request = require('request')
const config = require('../config/config')
const queue = require('../service/queue')

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

fb.getTaggedPhoto = (userId, accessToken) => {
  // add limit param for more photos
  const url = `${config.fb.baseUrl}/${userId}/photos?fields=tags,images&access_token=${accessToken}`
  request(url, (error, response, body) => {
    if (!error) {
      const data = JSON.parse(body).data
      queue.addJob(data, () => {
        // TODO: update user status in db
      })
    }
  })
}

module.exports = fb

