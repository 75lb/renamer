const Renamer = require('../')
const a = require('assert')
const createFixture = require('./lib/util').createFixture
const rimraf = require('rimraf')
const fs = require('fs')
const path = require('path')
const Tom = require('test-runner').Tom

const tom = module.exports = new Tom('api-bad-input')

const testRoot = `tmp/${path.basename(__filename)}`
rimraf.sync(testRoot)

tom.test('arrayifies files', function () {
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

tom.test('empty plugin list defaults to [ default, index ]', function () {
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

tom.test('no find or replace input')

tom.test('broken path-element', function () {
  const renamer = new Renamer()
  const options = {
    files: [ 'one' ],
    pathElement: 'broken'
  }
  a.throws(
    () => renamer.rename(options),
    /Invalid path element/i
  )
})
