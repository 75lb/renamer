var TestRunner = require('test-runner')
var renamer = require('../lib/renamer')
var Results = renamer.Results
var mfs = require('more-fs')
var fs = require('fs')
var path = require('path')
var a = require('core-assert')

var runner = new TestRunner()

function initFixture (dir) {
  mfs.rmdir('tmp/' + dir)
  mfs.write('tmp/' + dir + '/file1.txt')
  mfs.write('tmp/' + dir + '/file2.txt')
  mfs.write('tmp/' + dir + '/file3.txt')
}

function initFixture2 () {
  mfs.rmdir('tmp/fixture')
  mfs.write('tmp/fixture/1.txt')
  mfs.write('tmp/fixture/2.jpg')
  mfs.write('tmp/fixture/3.png')
}

runner.test('rename on disk', function () {
  initFixture('rename-one')
  var resultArray = [
    { before: 'tmp/rename-one/file1.txt', after: path.join('tmp', 'rename-one', 'clive1.txt') }
  ]
  var results = renamer.rename(new Results(resultArray))
  a.deepEqual(results.list, [
    { before: 'tmp/rename-one/file1.txt', after: path.join('tmp', 'rename-one', 'clive1.txt'), renamed: true }
  ])
  a.ok(!fs.existsSync('tmp/rename-one/file1.txt'), "file doesn't exist")
  a.ok(fs.existsSync(path.join('tmp', 'rename-one', 'clive1.txt')), 'file exists')
})

runner.test('rename on disk, file exists', function () {
  initFixture('rename-two')
  var resultArray = [
    { before: 'tmp/rename-two/file2.txt', after: 'tmp/rename-two/clive2.txt' },
    { before: 'tmp/rename-two/file3.txt', after: 'tmp/rename-two/clive2.txt' }
  ]
  var results = renamer.rename(new Results(resultArray))
  a.deepEqual(results.list, [
    { before: 'tmp/rename-two/file2.txt', after: 'tmp/rename-two/clive2.txt', renamed: true },
    { before: 'tmp/rename-two/file3.txt', after: 'tmp/rename-two/clive2.txt', renamed: false, error: 'file exists' }
  ])

  a.ok(!fs.existsSync('tmp/rename-two/file2.txt'), "file doesn't exist")
  a.ok(fs.existsSync('tmp/rename-two/clive2.txt'), 'file exists')
  a.ok(fs.existsSync('tmp/rename-two/file3.txt'), 'file exists')
})

runner.test('no .after specified', function () {
  initFixture('three')
  var resultArray = [
    { before: 'test/three/file1.txt' }
  ]
  var results = renamer.rename(new Results(resultArray))
  a.deepEqual(results.list, [
    { before: 'test/three/file1.txt', renamed: false, error: 'no change' }
  ])
})

runner.test('replace regex in multiple files', function () {
  initFixture2()
  var resultArray = [
    { before: 'tmp/fixture/1.txt', after: 'tmp/fixture/x.txt' },
    { before: 'tmp/fixture/2.jpg', after: 'tmp/fixture/x.jpg' },
    { before: 'tmp/fixture/3.png', after: 'tmp/fixture/x.png' }
  ]
  var results = renamer.rename(new Results(resultArray))
  a.deepEqual(results.list, [
    { before: 'tmp/fixture/1.txt', after: 'tmp/fixture/x.txt', renamed: true },
    { before: 'tmp/fixture/2.jpg', after: 'tmp/fixture/x.jpg', renamed: true },
    { before: 'tmp/fixture/3.png', after: 'tmp/fixture/x.png', renamed: true }
  ])
})

runner.test('crap input', function () {
  var resultArray = [
    { before: 'sdfsdg', after: 'dsfkhdlkfh' }
  ]
  var results = renamer.rename(new Results(resultArray))
  a.equal(results.list[0].before, 'sdfsdg')
  a.equal(results.list[0].after, 'dsfkhdlkfh')
  a.equal(results.list[0].renamed, false)
  a.ok(/ENOENT/.test(results.list[0].error), 'ENOENT')
})
