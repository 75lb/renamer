const util = require('../../lib/util')
const a = require('assert')
const createFixture = require('../lib/util').createFixture
const rimraf = require('rimraf')
const Tom = require('test-runner').Tom

const tom = module.exports = new Tom('util')

const testRoot = 'tmp/util'
rimraf.sync(testRoot)

tom.test('util.expandGlobPatterns', function () {
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

tom.test('util.expandGlobPatterns 2', function () {
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

tom.test('util.expandGlobPatterns 3', function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/[ok]`)
  const result = util.expandGlobPatterns([ `${testDir}/[ok]` ])
  a.deepStrictEqual(result, [
    `${testDir}/[ok]`
  ])
})

tom.test('util.depthFirstSort(files)', function () {
  const files = [ 'one', 'one/two', 'one/three', 'four', 'one/two/five' ]
  const result = util.depthFirstSort(files)
  a.deepStrictEqual(result, [ 'one/two/five', 'one/two', 'one/three', 'one', 'four' ])
})

tom.test('util.depthFirstCompare(pathA, pathB)', function () {
  a.deepStrictEqual(util.depthFirstCompare('/one/two', '/one'), -1)
  a.deepStrictEqual(util.depthFirstCompare('/one', '/one/two'), 1)
  a.deepStrictEqual(util.depthFirstCompare('/one', '/one'), 0)
})
