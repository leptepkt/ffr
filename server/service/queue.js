const kue = require('kue')
const image = require('./image')
const fb = require('./facebook')
const ms = require('./ms')

const queue = kue.createQueue()

const addJob = (data) => {
  const job = queue.create('crawlUserImage', data)
  job.on('complete', function (result) {
    // console.log(result)
  })
  job.save()

  //TODO: do we need to schedule execution?
  queue.process('crawlUserImage', (job, done) => {
    console.log(job.data)
    fb.getTaggedPhoto(job.data.id, job.data.accessToken).then(response => {
      for (const taggedImage of JSON.parse(response).data) {
        //TODO: remove if clause after testing
        // Detect user's face position
        let index = {}
        for (const taggedUser of taggedImage.tags.data) {
          if (taggedUser.id === job.data.id) {
            const imageProps = taggedImage.images[0]
            index = image.getRealIndex(taggedUser.x, taggedUser.y, imageProps.height, imageProps.width)
            break
          }
        }

        // Detect which one is user face base on real index
        const msData = `{"url": "${taggedImage.images[0].source}"}`
        ms.detectFace(msData, 'url').then(response => {
          for (const face of JSON.parse(response)) {
            const rectangle = {
              A: {
                x: face.faceRectangle.left,
                y: face.faceRectangle.top
              },
              B: {
                x: face.faceRectangle.left + face.faceRectangle.width,
                y: face.faceRectangle.top
              },
              C: {
                x: face.faceRectangle.left + face.faceRectangle.width,
                y: face.faceRectangle.top + face.faceRectangle.height
              },
              D: {
                x: face.faceRectangle.left,
                y: face.faceRectangle.top + face.faceRectangle.height
              },
            }
            if (image.isPointInRectangle(index, rectangle)) { // check if this face is correct face or not
              //TODO: crop image and upload
              image.cropImage(taggedImage.images[0].source, face.faceRectangle.left - 20, face.faceRectangle.top - 20,
                face.faceRectangle.width + 40, face.faceRectangle.height + 40)
                .then(image => {
                  // ms.addPersonFace()
                })
              break
            }
          }
        })
      }
      done()
    })
  })
}
module.exports = {
  addJob: addJob
}