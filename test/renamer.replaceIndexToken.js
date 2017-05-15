var TestRunner = require('test-runner')
var renamer = require('../lib/renamer')
var path = require('path')
var a = require('core-assert')

var runner = new TestRunner()

var preset = {
  one: [ 'file1.txt', 'file2.txt', 'folder/file3.txt' ]
}

runner.test('--replace: replace whole string', function () {
  var options = {
    files: preset.one,
    replace: '{{index}}.txt'
  }
  var results = renamer.replace(options)
  results = renamer.replaceIndexToken(results, options)
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
  results = renamer.replaceIndexToken(results, options )
  a.deepEqual(results.list, [
    { before: 'file1.txt', after: '1.txt' },
    { before: 'file2.txt', after: '2.txt' },
    { before: path.join('folder', 'file3.txt'), after: path.join('folder', '3.txt') }
  ])
})

runner.test('--replace, --num-format: replace whole string with format', function() {
  "use strict";
    var options = {
        files: preset.one,
        replace: '{{index}}.txt',
        'num-format': "%02d",
        regex: true
    }
    var results = renamer.replace(options)
    results = renamer.replaceIndexToken(results, options )
    a.deepEqual(results.list, [
        { before: 'file1.txt', after: '01.txt' },
        { before: 'file2.txt', after: '02.txt' },
        { before: path.join('folder', 'file3.txt'), after: path.join('folder', '03.txt') }
    ])
})

runner.test('--replace, --num-format: replace whole string with %f format', function() {
    "use strict";
    var options = {
        files: preset.one,
        replace: '{{index}}.txt',
        'num-format': "%05.2f",
        regex: true
    }
    var results = renamer.replace(options)
    results = renamer.replaceIndexToken(results, options )
    a.deepEqual(results.list, [
        { before: 'file1.txt', after: '01.00.txt' },
        { before: 'file2.txt', after: '02.00.txt' },
        { before: path.join('folder', 'file3.txt'), after: path.join('folder', '03.00.txt') }
    ])
})
