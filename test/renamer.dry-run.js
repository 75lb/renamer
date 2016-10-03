var TestRunner = require('test-runner')
var renamer = require('../lib/renamer')
var Results = renamer.Results
var a = require('core-assert')

var runner = new TestRunner()

runner.test('dryRun data added', function () {
  var resultList = [
    { before: 'file1.txt', after: 'file1.txt' },
    { before: 'file1.txt', after: 'clive.txt' },
    { before: 'file2.txt', after: 'clive.txt' },
    { before: 'file3.txt', after: 'clive3.txt' }
  ]
  var results = renamer.dryRun(new Results(resultList))
  a.deepEqual(results.list, [
    { before: 'file1.txt', after: 'file1.txt', renamed: false, error: 'no change' },
    { before: 'file1.txt', after: 'clive.txt', renamed: true },
    { before: 'file2.txt', after: 'clive.txt', renamed: false, error: 'file exists' },
    { before: 'file3.txt', after: 'clive3.txt', renamed: true }
  ])
})
