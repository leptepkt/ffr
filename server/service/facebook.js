const request = require('request')
const config = require('../config/config')
const queue = require('../service/queue')

const fb = {}

fb.getLongLivedToken = (accessToken) => {
  const url = `${config.fb.baseUrl}/oauth/access_token?grant_type=fb_exchange_token&client_id=${config.fb.appId}&client_secret=${config.fb.appSecret}&fb_exchange_token=${accessToken}`
  return new Promise((resolve, reject) => {
    request({
      url: url,
    }, (error, response, body) => {
      if (error) {
        reject(error)
      }
      resolve(body)
    })
  })
}

fb.getTaggedPhoto = (userId, accessToken) => {
  // add limit param for more photos
  const url = `${config.fb.baseUrl}/${userId}/photos?fields=tags,images&access_token=${accessToken}`
  return new Promise(((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        // const data = JSON.parse(body).data
        // queue.addJob(data, () => {
        //   // TODO: update user status in db
        // })
        reject(error)
      }
      resolve(body)
    })
  }))
}

module.exports = fb

