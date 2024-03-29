import { depthFirstCompare } from '../../lib/util.js'
import assert from 'assert'
import TestRunner from 'test-runner'
import fs from 'node:fs'

const a = assert.strict

const tom = new TestRunner.Tom()

const testRoot = 'tmp/util'
fs.rmSync(testRoot, { recursive: true, force: true })

tom.test('depthFirstSort(files)', function () {
  const files = ['one', 'one/two', 'one/three', 'four', 'one/two/five']
  const result = files.sort(depthFirstCompare)
  a.deepEqual(result, ['one/two/five', 'one/two', 'one/three', 'one', 'four'])
})

tom.test('depthFirstCompare(pathA, pathB)', function () {
  a.deepEqual(depthFirstCompare('/one/two', '/one'), -1)
  a.deepEqual(depthFirstCompare('/one', '/one/two'), 1)
  a.deepEqual(depthFirstCompare('/one', '/one'), 0)
})

export default tom
