import {expandGlobPatterns, depthFirstSort, depthFirstCompare} from '../../lib/util.mjs'
import a from 'assert'
import { createFixture } from '../lib/util.mjs'
import rimraf from 'rimraf'
import TestRunner from 'test-runner'

const tom = new TestRunner.Tom()

const testRoot = 'tmp/util'
rimraf.sync(testRoot)

tom.test('expandGlobPatterns', function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/one`)
  createFixture(`${testDir}/two/three`)
  const result = expandGlobPatterns([`${testDir}/**`])
  a.deepStrictEqual(result, [
    `${testDir}`,
    `${testDir}/one`,
    `${testDir}/two`,
    `${testDir}/two/three`
  ])
})

tom.test('expandGlobPatterns 2', function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/one`)
  createFixture(`${testDir}/two/three`)
  const result = expandGlobPatterns([`${testDir}/one`, `${testDir}/**`])
  a.deepStrictEqual(result, [
    `${testDir}/one`,
    `${testDir}`,
    `${testDir}/two`,
    `${testDir}/two/three`
  ])
})

tom.test('expandGlobPatterns 3', function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/[ok]`)
  const result = expandGlobPatterns([`${testDir}/[ok]`])
  a.deepStrictEqual(result, [
    `${testDir}/[ok]`
  ])
})

tom.test('depthFirstSort(files)', function () {
  const files = ['one', 'one/two', 'one/three', 'four', 'one/two/five']
  const result = depthFirstSort(files)
  a.deepStrictEqual(result, ['one/two/five', 'one/two', 'one/three', 'one', 'four'])
})

tom.test('depthFirstCompare(pathA, pathB)', function () {
  a.deepStrictEqual(depthFirstCompare('/one/two', '/one'), -1)
  a.deepStrictEqual(depthFirstCompare('/one', '/one/two'), 1)
  a.deepStrictEqual(depthFirstCompare('/one', '/one'), 0)
})

export default tom
