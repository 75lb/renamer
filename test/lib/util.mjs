import mkdirp from 'mkdirp2'
import path from 'path'
import fs from 'fs'

function createFixture (filePath) {
  const dirname = path.dirname(filePath)
  mkdirp.sync(dirname)
  fs.writeFileSync(filePath, 'test')
  return filePath
}

export { createFixture }
