const Renamer = require('../')
const TestRunner = require('test-runner')
const a = require('assert')
const createFixture = require('./lib/util').createFixture
const rimraf = require('rimraf')
const fs = require('fs')
const path = require('path')

const runner = new TestRunner()

const sectionFolder = 'tmp/plugin'
rimraf.sync(sectionFolder)

runner.test('plugin: default plugin, {{index}}', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath ],
    replace: '{{index}}'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/1`), true)
})

runner.test('plugin: default plugin, {{index}}, depth', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/dir/two`)
  createFixture(`${testFolder}/dir/one`)
  const renamer = new Renamer()
  const options = {
    files: [ `${testFolder}/**` ],
    find: 'one',
    replace: '{{index}}'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/2`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/two`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/2`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/1`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/3`), false)
})
