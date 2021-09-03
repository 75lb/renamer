import path from 'path'
import fs from 'fs'

function createFixture (filePath) {
  const dirname = path.dirname(filePath)
  fs.mkdirSync(dirname, { recursive: true })
  fs.writeFileSync(filePath, 'test')
  return filePath
}

export { createFixture }
