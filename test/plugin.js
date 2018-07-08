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

runner.test('plugin: default plugins, {{index}}', function () {
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

runner.test('plugin: default plugins, {{index}} two files same depth', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/two`)
  const renamer = new Renamer()
  const options = {
    files: [ `${testFolder}/two`, `${testFolder}/one` ],
    find: /(.+)/,
    replace: '$1{{index}}'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/two`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/two1`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/one2`), true)
})

runner.test('plugin: default plugins, {{index}} two files same depth, different order', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/two`)
  const renamer = new Renamer()
  const options = {
    files: [ `${testFolder}/one`, `${testFolder}/two` ],
    find: /(.+)/,
    replace: '$1{{index}}'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/two`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/one1`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/two2`), true)
})

runner.test('plugin: default plugins, {{index}} with depth', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/dir/one`)
  createFixture(`${testFolder}/dir/two`)
  const renamer = new Renamer()
  const options = {
    files: [ `${testFolder}/one`, `${testFolder}/dir/one`, `${testFolder}/dir/two` ],
    find: 'e',
    replace: 'e{{index}}'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/two`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/one1`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/one2`), true)
})

runner.test('plugin: default plugins, {{index}} with depth, different order', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/dir/one`)
  createFixture(`${testFolder}/dir/two`)
  const renamer = new Renamer()
  const options = {
    files: [ `${testFolder}/dir/one`, `${testFolder}/one`, `${testFolder}/dir/two` ],
    find: 'e',
    replace: 'e{{index}}'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/two`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/one1`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/one2`), true)
})
