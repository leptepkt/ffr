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
    fb.getTaggedPhoto(job.data.id, job.data.accessToken).then(response => {
      const genObj = genFunc(JSON.parse(response).data)
      let interval = setInterval(() => {
        const val = genObj.next()
        if (val.done) {
          clearInterval(interval)
        } else {
          const taggedImage = val.value
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
                    ms.addPersonFace(job.data.msId, image.buffer, 'buffer')
                      .catch(error => {
                        console.log(error)
                      })
                  })
                break
              }
            }
          })
        }
      }, 30 * 1000)

      // for (const taggedImage of JSON.parse(response).data) {
      //   // Detect user's face position
      //   let index = {}
      //   for (const taggedUser of taggedImage.tags.data) {
      //     if (taggedUser.id === job.data.id) {
      //       const imageProps = taggedImage.images[0]
      //       index = image.getRealIndex(taggedUser.x, taggedUser.y, imageProps.height, imageProps.width)
      //       break
      //     }
      //   }
      //
      //   // Detect which one is user face base on real index
      //   const msData = `{"url": "${taggedImage.images[0].source}"}`
      //   ms.detectFace(msData, 'url').then(response => {
      //     for (const face of JSON.parse(response)) {
      //       const rectangle = {
      //         A: {
      //           x: face.faceRectangle.left,
      //           y: face.faceRectangle.top
      //         },
      //         B: {
      //           x: face.faceRectangle.left + face.faceRectangle.width,
      //           y: face.faceRectangle.top
      //         },
      //         C: {
      //           x: face.faceRectangle.left + face.faceRectangle.width,
      //           y: face.faceRectangle.top + face.faceRectangle.height
      //         },
      //         D: {
      //           x: face.faceRectangle.left,
      //           y: face.faceRectangle.top + face.faceRectangle.height
      //         },
      //       }
      //       if (image.isPointInRectangle(index, rectangle)) { // check if this face is correct face or not
      //         //TODO: crop image and upload
      //         image.cropImage(taggedImage.images[0].source, face.faceRectangle.left - 20, face.faceRectangle.top - 20,
      //           face.faceRectangle.width + 40, face.faceRectangle.height + 40)
      //           .then(image => {
      //             ms.addPersonFace(job.data.msId, image.buffer, 'buffer')
      //               .catch(error => {
      //                 console.log(error)
      //               })
      //           })
      //         break
      //       }
      //     }
      //   })
      // }
      done()
    })
  })
}

function * genFunc (taggedPhotos) {
  for (const photo of taggedPhotos) {
    yield photo
  }
}

module.exports = {
  addJob: addJob
}