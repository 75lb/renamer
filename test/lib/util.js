import path from 'node:path'
import fs from 'node:fs'

function createFixture (filePath) {
  const dirname = path.dirname(filePath)
  fs.mkdirSync(dirname, { recursive: true })
  fs.writeFileSync(filePath, 'test')
  return filePath
}

export { createFixture }
