import { depthFirstCompare } from '../../lib/util.js'
import os from 'os'

const [test, only, skip] = [new Map(), new Map(), new Map()]

if (os.platform() === 'win32') {
  test.set('depthFirstCompare(pathA, pathB) windows 1', function () {
    a.deepEqual(depthFirstCompare('\\one\\two', '\\one'), -1)
    a.deepEqual(depthFirstCompare('\\one', '\\one\\two'), 1)
    a.deepEqual(depthFirstCompare('\\one', '\\one'), 0)
  })

  test.set('depthFirstCompare(pathA, pathB) windows 2 (cygwin usage)', function () {
    a.deepEqual(depthFirstCompare('/one/two', '/one'), -1)
    a.deepEqual(depthFirstCompare('/one', '/one/two'), 1)
    a.deepEqual(depthFirstCompare('/one', '/one'), 0)
  })
}

export { test, only, skip }
