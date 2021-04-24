import renameFile from '../../lib/rename-file.mjs'
import assert from 'assert'
import fs from 'fs'
import { createFixture } from '../lib/util.mjs'
import rimraf from 'rimraf'
import TestRunner from 'test-runner'
const a = assert.strict

const tom = new TestRunner.Tom()

rimraf.sync('tmp/rename-file')

tom.test('simple', async function () {
  const fromPath = createFixture(`tmp/rename-file/${this.index}/one`)
  const toPath = `tmp/rename-file/${this.index}/oneyeah`
  await renameFile(fromPath, toPath)
  a.deepEqual(fs.existsSync(fromPath), false)
  a.deepEqual(fs.existsSync(toPath), true)
})

tom.test('must not overwrite', async function () {
  const fixturePath = createFixture(`tmp/rename-file/${this.index}/one`)
  const fixturePath2 = createFixture(`tmp/rename-file/${this.index}/two`)
  await a.rejects(
    () => renameFile(fixturePath, fixturePath2),
    /file exists/
  )
  a.deepEqual(fs.existsSync(fixturePath), true)
  a.deepEqual(fs.existsSync(fixturePath2), true)
})

tom.test('must not overwrite, find and replace same', async function () {
  const fixturePath = createFixture(`tmp/rename-file/${this.index}/one`)
  await a.rejects(
    () => renameFile(fixturePath, fixturePath),
    /file exists/
  )
  a.deepEqual(fs.existsSync(fixturePath), true)
})

export default tom
