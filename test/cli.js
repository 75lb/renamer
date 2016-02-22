var test = require('tape')
var fs = require('fs')
var path = require('path')
var mfs = require('more-fs')
var exec = require('child_process').exec

function initFixture () {
  mfs.rmdir('test/fixture')
  mfs.write('test/fixture/clive1.txt')
  mfs.write('test/fixture/clive2.txt')
  mfs.write('test/fixture/file3.txt')
}

test('cli: no args', function (t) {
  initFixture()
  t.plan(2)
  exec('node bin/cli.js', function (err, stdout) {
    t.ok(/renamer/.test(stdout), 'usage is there')
    if (err) {
      t.error(err)
    } else {
      t.pass('ran ok. ')
    }
  })
})

test('cli: simple replace', function (t) {
  initFixture()
  t.plan(6)
  exec('node bin/cli.js -f clive -r hater test/fixture/*', function (err) {
    if (err) {
      t.error(err)
    } else {
      t.pass('ran ok. ')
    }

    t.notOk(fs.existsSync(path.join('test', 'fixture', 'clive1.txt')), "file doesn't exist")
    t.notOk(fs.existsSync(path.join('test', 'fixture', 'clive2.txt')), "file doesn't exist")
    t.ok(fs.existsSync(path.join('test', 'fixture', 'hater1.txt')), 'file exists')
    t.ok(fs.existsSync(path.join('test', 'fixture', 'hater2.txt')), 'file exists')
    t.ok(fs.existsSync(path.join('test', 'fixture', 'file3.txt')), 'file exists')
  })
})
