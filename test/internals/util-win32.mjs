import { depthFirstCompare } from '../../lib/util.mjs'
import assert from 'assert'
import os from 'os'
import TestRunner from 'test-runner'
const a = assert.strict

const tom = new TestRunner.Tom()

if (os.platform() === 'win32') {
  tom.test('depthFirstCompare(pathA, pathB) windows 1', function () {
    a.deepEqual(depthFirstCompare('\\one\\two', '\\one'), -1)
    a.deepEqual(depthFirstCompare('\\one', '\\one\\two'), 1)
    a.deepEqual(depthFirstCompare('\\one', '\\one'), 0)
  })

  tom.test('depthFirstCompare(pathA, pathB) windows 2 (cygwin usage)', function () {
    a.deepEqual(depthFirstCompare('/one/two', '/one'), -1)
    a.deepEqual(depthFirstCompare('/one', '/one/two'), 1)
    a.deepEqual(depthFirstCompare('/one', '/one'), 0)
  })
}

export default tom
