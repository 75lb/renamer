'use strict'
const renameFile = require('../lib/rename-file')
const TestRunner = require('test-runner')
const a = require('assert')
const fs = require('fs')
const createFixture = require('./lib/util').createFixture
const rimraf = require('rimraf')

const runner = new TestRunner()

rimraf.sync('tmp/rename-file')

runner.test('renameFile: simple', function () {
  const fixturePath = createFixture(`tmp/rename-file/${this.index}/one`)
  renameFile(fixturePath, `tmp/rename-file/${this.index}/oneyeah`)
  a.deepStrictEqual(fs.existsSync(fixturePath), false)
  a.deepStrictEqual(fs.existsSync(`tmp/rename-file/${this.index}/oneyeah`), true)
})

runner.test('renameFile: must not overwrite', function () {
  const fixturePath = createFixture(`tmp/rename-file/${this.index}/one`)
  const fixturePath2 = createFixture(`tmp/rename-file/${this.index}/two`)
  a.throws(
    () => renameFile(fixturePath, fixturePath2)
  )
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  a.deepStrictEqual(fs.existsSync(fixturePath2), true)
})

runner.test('renameFile: must not overwrite, find and replace same', function () {
  const fixturePath = createFixture(`tmp/rename-file/${this.index}/one`)
  a.throws(
    () => renameFile(fixturePath, fixturePath)
  )
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
})
