var TestRunner = require('test-runner')
var renamer = require('../lib/renamer')
var path = require('path')
var a = require('assert')

var runner = new TestRunner()

var preset = {
  one: [ 'file1.txt', 'file2.txt', 'folder/file3.txt' ],
  two: [ 'file1.txt', 'file2.txt', 'file3.txt',
         'file4.txt', 'file5.txt', 'file6.txt',
         'file7.txt', 'file8.txt', 'file9.txt',
         'file10.txt', 'file11.txt', 'file12.txt',
         'folder/file13.txt' ],
}

runner.test('--replace: replace whole string', function () {
  var options = {
    files: preset.one,
    replace: '{{index}}.txt'
  }
  var results = renamer.replace(options)
  results = renamer.replaceIndexToken(results)
  a.deepEqual(results.list, [
    { before: 'file1.txt', after: '1.txt' },
    { before: 'file2.txt', after: '2.txt' },
    { before: path.join('folder', 'file3.txt'), after: path.join('folder', '3.txt') }
  ])
})

runner.test('--replace, --regex: replace whole string', function () {
  var options = {
    files: preset.one,
    replace: '{{index}}.txt',
    regex: true
  }
  var results = renamer.replace(options)
  results = renamer.replaceIndexToken(results)
  a.deepEqual(results.list, [
    { before: 'file1.txt', after: '1.txt' },
    { before: 'file2.txt', after: '2.txt' },
    { before: path.join('folder', 'file3.txt'), after: path.join('folder', '3.txt') }
  ])
})

runner.test('--replace: replace whole string with indexZeroPrefixed', function () {
  var options = {
    files: preset.two,
    replace: '{{indexZeroPrefixed}}.txt'
  }
  var results = renamer.replace(options)
  results = renamer.replaceIndexTokenZeroPrefixed(results)
  a.deepEqual(results.list, [
    { before: 'file1.txt', after: '0001.txt' },
    { before: 'file2.txt', after: '0002.txt' },
    { before: 'file3.txt', after: '0003.txt' },
    { before: 'file4.txt', after: '0004.txt' },
    { before: 'file5.txt', after: '0005.txt' },
    { before: 'file6.txt', after: '0006.txt' },
    { before: 'file7.txt', after: '0007.txt' },
    { before: 'file8.txt', after: '0008.txt' },
    { before: 'file9.txt', after: '0009.txt' },
    { before: 'file10.txt', after: '0010.txt' },
    { before: 'file11.txt', after: '0011.txt' },
    { before: 'file12.txt', after: '0012.txt' },
    { before: path.join('folder', 'file13.txt'), after: path.join('folder', '0013.txt') }
  ])
})
