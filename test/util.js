const util = require('../lib/util')
const TestRunner = require('test-runner')
const a = require('assert')
const createFixture = require('./lib/util').createFixture
const rimraf = require('rimraf')

const runner = new TestRunner()

const testRoot = 'tmp/util'
rimraf.sync(testRoot)

runner.test('util.expandGlobPatterns', function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/one`)
  createFixture(`${testDir}/two/three`)
  const result = util.expandGlobPatterns([ `${testDir}/**` ])
  a.deepStrictEqual(result, [
    `${testDir}`,
    `${testDir}/one`,
    `${testDir}/two`,
    `${testDir}/two/three`
  ])
})

runner.test('util.expandGlobPatterns 2', function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/one`)
  createFixture(`${testDir}/two/three`)
  const result = util.expandGlobPatterns([ `${testDir}/one`, `${testDir}/**` ])
  a.deepStrictEqual(result, [
    `${testDir}/one`,
    `${testDir}`,
    `${testDir}/two`,
    `${testDir}/two/three`
  ])
})

runner.test('util.expandGlobPatterns 3', function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/[ok]`)
  const result = util.expandGlobPatterns([ `${testDir}/[ok]` ])
  a.deepStrictEqual(result, [
    `${testDir}/[ok]`
  ])
})

runner.test('util.depthFirstSort(files)', function () {
  const files = [ 'one', 'one/two', 'one/three', 'four', 'one/two/five' ]
  const result = util.depthFirstSort(files)
  a.deepStrictEqual(result, [ 'one/two/five', 'one/two', 'one/three', 'one', 'four' ])
})
