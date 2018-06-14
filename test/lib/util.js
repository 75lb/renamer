'use strict'
const mkdirp = require('mkdirp2')
const path = require('path')
const fs = require('fs')

function createFixture (filePath) {
  const dirname = path.dirname(filePath)
  mkdirp.sync(dirname)
  fs.writeFileSync(filePath, 'test')
  return filePath
}

exports.createFixture = createFixture
