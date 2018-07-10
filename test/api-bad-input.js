const Renamer = require('../')
const TestRunner = require('test-runner')
const a = require('assert')
const createFixture = require('./lib/util').createFixture
const rimraf = require('rimraf')
const fs = require('fs')
const path = require('path')

const runner = new TestRunner()

const testRoot = `tmp/${path.basename(__filename)}`
rimraf.sync(testRoot)

runner.test('renamer: arrayifies files', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: fixturePath,
    find: 'o',
    replace: 'a'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testRoot}/${this.index}/ane`), true)
})

runner.test('renamer: empty plugin list defaults to [ default, index ]', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath ],
    plugin: [],
    find: 'o',
    replace: 'a'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testRoot}/${this.index}/ane`), true)
})

runner.test('renamer: no find or replace input')
