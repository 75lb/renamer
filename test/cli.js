var TestRunner = require('test-runner')
var fs = require('fs')
var path = require('path')
var mfs = require('more-fs')
var exec = require('child_process').exec
var a = require('core-assert')

var runner = new TestRunner()

function initFixture () {
  mfs.rmdir('tmp/test-cli')
  mfs.write('tmp/test-cli/clive1.txt')
  mfs.write('tmp/test-cli/clive2.txt')
  mfs.write('tmp/test-cli/file3.txt')
}

runner.test('cli: no args', function () {
  initFixture()
  return new Promise(function (resolve, reject) {
    exec('node bin/cli.js', function (err, stdout) {
      if (err) return reject(err)
      a.ok(/renamer/.test(stdout), 'usage is there')
      resolve()
    })
  })
})

runner.test('cli: simple replace', function () {
  initFixture()
  return new Promise(function (resolve, reject) {
    exec('node bin/cli.js -f clive -r hater test/fixture/*', function (err) {
      if (err) return reject(err)

      a.ok(!fs.existsSync(path.join('test', 'fixture', 'clive1.txt')), "file doesn't exist")
      a.ok(!fs.existsSync(path.join('test', 'fixture', 'clive2.txt')), "file doesn't exist")
      a.ok(fs.existsSync(path.join('test', 'fixture', 'hater1.txt')), 'file exists')
      a.ok(fs.existsSync(path.join('test', 'fixture', 'hater2.txt')), 'file exists')
      a.ok(fs.existsSync(path.join('test', 'fixture', 'file3.txt')), 'file exists')
      resolve()
    })
  })
})
