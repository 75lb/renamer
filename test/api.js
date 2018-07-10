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

runner.test('renamer: simple rename', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath ],
    find: 'o',
    replace: 'a'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testRoot}/${this.index}/ane`), true)
})

runner.test('renamer: nothing found', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath ],
    find: 'qqqq',
    replace: 'a'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testRoot}/${this.index}/one`), true)
})

runner.test('renamer: target exists', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  createFixture(`${testRoot}/${this.index}/two`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath ],
    find: 'one',
    replace: 'two'
  }
  a.throws(
    () => renamer.rename(options),
    err => err.code === 'exists'
  )
})

runner.test('renamer: target exists, force', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const fixturePath2 = createFixture(`${testRoot}/${this.index}/two`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath ],
    find: 'one',
    replace: 'two',
    force: true
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(fixturePath), false)
  a.strictEqual(fs.existsSync(fixturePath2), true)
})

runner.test("renamer: file doesn't exist", function () {
  const renamer = new Renamer()
  const options = {
    files: [ 'asdfasfewf' ],
    find: 'a',
    replace: 'e'
  }
  a.throws(
    () => renamer.rename(options),
    /ENOENT/
  )
})

runner.test('renamer: simple rename, dry-run', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath ],
    find: 'o',
    replace: 'a',
    dryRun: true
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testRoot}/${this.index}/ane`), false)
  a.strictEqual(fs.existsSync(`${testRoot}/${this.index}/one`), true)
})

runner.test('renamer: empty result throws', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath ],
    find: 'one',
    replace: ''
  }
  a.throws(
    () => renamer.rename(options),
    /empty/
  )
})

runner.test('rename symlink')

runner.test('renamer: depth-first renaming', function () {
  const testDir = `${testRoot}/${this.index}`
  const renamer = new Renamer()
  createFixture(`${testDir}/one/two`)
  renamer.rename({ files: [ `${testDir}/one`, `${testDir}/one/two` ], find: 'o', replace: 'a' })
  a.strictEqual(fs.existsSync(`${testDir}/one`), false)
  a.strictEqual(fs.existsSync(`${testDir}/one/two`), false)
  a.strictEqual(fs.existsSync(`${testDir}/ane`), true)
  a.strictEqual(fs.existsSync(`${testDir}/ane/twa`), true)
})
