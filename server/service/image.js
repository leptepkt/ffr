const Jimp = require('jimp')

const isPointInRectangle = (p, r) => {
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

const getRealIndex = (xPercent, yPercent, height, width) => {
  return {
    x: xPercent * width / 100,
    y: yPercent * height / 100
  }
}

const cropImage = (url, x, y, w, h) => {
  return new Promise((resolve, reject) => {
    Jimp.read(url, function (err, image) {
      if (err) {
        reject(err)
      }
      // resolve(image.crop(x, y, w, h, (image) => {
      //   //TODO: remove below test function
      //   test(image, url)
      // }))
      const image2 = image.crop(x, y, w, h)
      test(image2, url)
    })
  })
}

const test = (image, url) => {
  const file = `D:\\${url.substring(url.length, url.length-5)}.${image.getExtension()}`
  image.write(file)
}

module.exports = {
  isPointInRectangle: isPointInRectangle,
  getRealIndex: getRealIndex,
  cropImage: cropImage
}
