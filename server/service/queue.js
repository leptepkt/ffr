const kue = require('kue')
const image = require('./image')

const queue = kue.createQueue()

const addJob = (data, cb) => {
  const job = queue.create('crawlUserImage', data)
  job.on('complete', function (result) {
    if (cb) {
      cb()
    }
  })
  job.save()

  //TODO: do we need to schedule execution?
  queue.process('crawlUserImage', (job, done) => {

  })
}
 module.exports = {
  addJob: addJob
 }