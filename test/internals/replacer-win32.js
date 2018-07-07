'use strict'
const replacer = require('../../lib/replacer')
const TestRunner = require('test-runner')
const a = require('assert')
const os = require('os')

const runner = new TestRunner()

if (os.platform() === 'win32') {
  runner.test('Simple win32', function () {
    const input = [
      'one',
      'one\\two',
      'two\\one one'
    ]
    const expected = [
      'yeah',
      'one\\two',
      'two\\yeah yeah'
    ]
    const result = Array.from(replacer(input, /one/g, 'yeah'))
    a.deepStrictEqual(result, expected)
  })
}
