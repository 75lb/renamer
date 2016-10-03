var TestRunner = require('test-runner')
var fs = require('fs')
var path = require('path')
var mfs = require('more-fs')
var exec = require('child_process').exec
var a = require('core-assert')

var runner = new TestRunner()

function initFixture (dir) {
  mfs.rmdir('tmp/' + dir)
  mfs.write('tmp/' + dir + '/clive1.txt')
  mfs.write('tmp/' + dir + '/clive2.txt')
  mfs.write('tmp/' + dir + '/file3.txt')
}

runner.test('cli: no args', function () {
  return new Promise(function (resolve, reject) {
    exec('node bin/cli.js', function (err, stdout) {
      if (err) return reject(err)
      a.ok(/renamer/.test(stdout), 'usage is there')
      resolve()
    })
  })
})

runner.test('cli: simple replace', function () {
  initFixture('test-cli')
  return new Promise(function (resolve, reject) {
    exec('node bin/cli.js -f clive -r hater tmp/test-cli/*', function (err) {
      if (err) return reject(err)

      a.ok(!fs.existsSync(path.join('tmp', 'test-cli', 'clive1.txt')), "file doesn't exist")
      a.ok(!fs.existsSync(path.join('tmp', 'test-cli', 'clive2.txt')), "file doesn't exist")
      a.ok(fs.existsSync(path.join('tmp', 'test-cli', 'hater1.txt')), 'file exists')
      a.ok(fs.existsSync(path.join('tmp', 'test-cli', 'hater2.txt')), 'file exists')
      a.ok(fs.existsSync(path.join('tmp', 'test-cli', 'file3.txt')), 'file exists')
      resolve()
    })
  })
})
