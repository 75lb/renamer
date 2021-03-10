import renameFile from '../../lib/rename-file.mjs'
import a from 'assert'
import fs from 'fs'
import { createFixture } from '../lib/util.mjs'
import rimraf from 'rimraf'
import TestRunner from 'test-runner'

const tom = new TestRunner.Tom()

rimraf.sync('tmp/rename-file')

tom.test('simple', function () {
  const fixturePath = createFixture(`tmp/rename-file/${this.index}/one`)
  renameFile(fixturePath, `tmp/rename-file/${this.index}/oneyeah`)
  a.deepStrictEqual(fs.existsSync(fixturePath), false)
  a.deepStrictEqual(fs.existsSync(`tmp/rename-file/${this.index}/oneyeah`), true)
})

tom.test('must not overwrite', function () {
  const fixturePath = createFixture(`tmp/rename-file/${this.index}/one`)
  const fixturePath2 = createFixture(`tmp/rename-file/${this.index}/two`)
  a.throws(
    () => renameFile(fixturePath, fixturePath2),
    /file exists/
  )
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  a.deepStrictEqual(fs.existsSync(fixturePath2), true)
})

tom.test('must not overwrite, find and replace same', function () {
  const fixturePath = createFixture(`tmp/rename-file/${this.index}/one`)
  a.throws(
    () => renameFile(fixturePath, fixturePath),
    /file exists/
  )
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
})

export default tom
