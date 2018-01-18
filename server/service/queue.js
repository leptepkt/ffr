const kue = require('kue')
const image = require('./image')
const fb = require('./facebook')

const queue = kue.createQueue()

const addJob = (data) => {
  const job = queue.create('crawlUserImage', data)
  job.on('complete', function (result) {
    console.log(result)
  })
  job.save()

  //TODO: do we need to schedule execution?
  queue.process('crawlUserImage', (job, done) => {
    fb.getTaggedPhoto(job.data.id, job.data.accessToken).then(response => {
      done()
    })
  })
}
 module.exports = {
  addJob: addJob
 }