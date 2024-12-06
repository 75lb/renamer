import { depthFirstCompare } from '../../lib/util.js'
import fs from 'node:fs'
import { strict as a } from 'assert'

const testRoot = 'tmp/util'
fs.rmSync(testRoot, { recursive: true, force: true })

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('depthFirstSort(files)', function () {
  const files = ['one', 'one/two', 'one/three', 'four', 'one/two/five']
  const result = files.sort(depthFirstCompare)
  a.deepEqual(result, ['one/two/five', 'one/two', 'one/three', 'one', 'four'])
})

test.set('depthFirstCompare(pathA, pathB)', function () {
  a.deepEqual(depthFirstCompare('/one/two', '/one'), -1)
  a.deepEqual(depthFirstCompare('/one', '/one/two'), 1)
  a.deepEqual(depthFirstCompare('/one', '/one'), 0)
})

export { test, only, skip }
