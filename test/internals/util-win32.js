const util = require('../../lib/util')
const a = require('assert')
const os = require('os')
const Tom = require('test-runner').Tom

const tom = module.exports = new Tom('util-win32')

if (os.platform() === 'win32') {
  tom.test('util.depthFirstCompare(pathA, pathB) windows 1', function () {
    a.deepStrictEqual(util.depthFirstCompare('\\one\\two', '\\one'), -1)
    a.deepStrictEqual(util.depthFirstCompare('\\one', '\\one\\two'), 1)
    a.deepStrictEqual(util.depthFirstCompare('\\one', '\\one'), 0)
  })

  tom.test('util.depthFirstCompare(pathA, pathB) windows 2 (cygwin usage)', function () {
    a.deepStrictEqual(util.depthFirstCompare('/one/two', '/one'), -1)
    a.deepStrictEqual(util.depthFirstCompare('/one', '/one/two'), 1)
    a.deepStrictEqual(util.depthFirstCompare('/one', '/one'), 0)
  })
}
