const util = require('../../lib/util')
const TestRunner = require('test-runner')
const a = require('assert')
const os = require('os')

const runner = new TestRunner()

if (os.platform() === 'win32') {
  runner.test('util.depthFirstCompare(pathA, pathB) windows 1', function () {
    a.deepStrictEqual(util.depthFirstCompare('\\one\\two', '\\one'), -1)
    a.deepStrictEqual(util.depthFirstCompare('\\one', '\\one\\two'), 1)
    a.deepStrictEqual(util.depthFirstCompare('\\one', '\\one'), 0)
  })

  runner.test('util.depthFirstCompare(pathA, pathB) windows 2 (cygwin usage)', function () {
    a.deepStrictEqual(util.depthFirstCompare('/one/two', '/one'), -1)
    a.deepStrictEqual(util.depthFirstCompare('/one', '/one/two'), 1)
    a.deepStrictEqual(util.depthFirstCompare('/one', '/one'), 0)
  })
}
