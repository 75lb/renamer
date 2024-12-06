import renameFile from '../../lib/rename-file.js'
import fs from 'fs'
import { createFixture } from '../lib/util.js'
import { strict as a } from 'assert'

fs.rmSync('tmp/rename-file', { recursive: true, force: true })

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('simple', async function () {
  const fromPath = createFixture(`tmp/rename-file/${this.index}/one`)
  const toPath = `tmp/rename-file/${this.index}/oneyeah`
  await renameFile(fromPath, toPath)
  a.deepEqual(fs.existsSync(fromPath), false)
  a.deepEqual(fs.existsSync(toPath), true)
})

test.set('must not overwrite', async function () {
  const fixturePath = createFixture(`tmp/rename-file/${this.index}/one`)
  const fixturePath2 = createFixture(`tmp/rename-file/${this.index}/two`)
  await a.rejects(
    () => renameFile(fixturePath, fixturePath2),
    /file exists/
  )
  a.deepEqual(fs.existsSync(fixturePath), true)
  a.deepEqual(fs.existsSync(fixturePath2), true)
})

test.set('must not overwrite, find and replace same', async function () {
  const fixturePath = createFixture(`tmp/rename-file/${this.index}/one`)
  await a.rejects(
    () => renameFile(fixturePath, fixturePath),
    /file exists/
  )
  a.deepEqual(fs.existsSync(fixturePath), true)
})

export { test, only, skip }
