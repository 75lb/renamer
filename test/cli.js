const CliApp = require('../lib/cli-app')
const TestRunner = require('test-runner')
const a = require('assert')
const createFixture = require('./lib/util').createFixture
const fs = require('fs')
const rimraf = require('rimraf')
const path = require('path')

const runner = new TestRunner()
const testRoot = `tmp/${path.basename(__filename)}`
rimraf.sync(testRoot)

runner.test('cli: simple', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const origArgv = process.argv
  process.argv = [ 'node', 'test', '--find', 'one', '--replace', 'yeah', fixturePath ]
  const cliApp = new CliApp()
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  cliApp.start()
  process.argv = origArgv
  a.deepStrictEqual(fs.existsSync(fixturePath), false)
  a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

runner.test('cli: simple, using bin', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const origArgv = process.argv
  process.argv = [ 'node', 'test', '--find', 'one', '--replace', 'yeah', fixturePath ]
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  require('../bin/cli')
  process.argv = origArgv
  a.deepStrictEqual(fs.existsSync(fixturePath), false)
  a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

runner.test('cli: simple, find string not found', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const origArgv = process.argv
  process.argv = [ 'node', 'test', '--find', 'o.e', '--replace', 'yeah', fixturePath ]
  const cliApp = new CliApp()
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  cliApp.start()
  process.argv = origArgv
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), false)
})

runner.test('cli: simple regexp', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const origArgv = process.argv
  process.argv = [ 'node', 'test', '--find', '/o.e/', '--replace', 'yeah', fixturePath ]
  const cliApp = new CliApp()
  a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/one`), true)
  cliApp.start()
  process.argv = origArgv
  a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/one`), false)
  a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

runner.test('cli: simple regexp, case sensitive', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/ONE`)
  const origArgv = process.argv
  process.argv = [ 'node', 'test', '--find', '/one/', '--replace', 'yeah', fixturePath ]
  const cliApp = new CliApp()
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  cliApp.start()
  process.argv = origArgv
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), false)
})

runner.test('cli: simple regexp, insensitive', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/ONE`)
  const origArgv = process.argv
  process.argv = [ 'node', 'test', '--find', '/one/i', '--replace', 'yeah', fixturePath ]
  const cliApp = new CliApp()
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  cliApp.start()
  process.argv = origArgv
  a.deepStrictEqual(fs.existsSync(fixturePath), false)
  a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

runner.test('cli: input file list on stdin', function () {
  const spawn = require('child_process').spawn
  const path = require('path')
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = spawn('node', [ path.join('bin', 'cli.js'), '-f', 'one', '-r', 'two' ])
  return new Promise((resolve, reject) => {
    renamer.on('close', () => {
      a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/one`), false)
      a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/two`), true)
      resolve()
    })
    renamer.stdin.end(fixturePath)
  })
})

runner.test('cli: --help', function () {
  const origArgv = process.argv
  process.argv = [ 'node', 'test', '--help' ]
  const cliApp = new CliApp()
  let output = ''
  cliApp.log = function (msg) {
    output += msg
  }
  cliApp.start()
  a.strictEqual(output.match(/Synopsis/g).length, 1)
  process.argv = origArgv
})

runner.test('cli: --regexp, append extention', function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/one1`)
  createFixture(`${testDir}/one2`)
  const origArgv = process.argv
  process.argv = [ 'node', 'test', '-f', '/(.+)/', '-r', '$1.log', `${testDir}/*` ]
  const cliApp = new CliApp()
  cliApp.start()
  a.strictEqual(fs.existsSync(`${testDir}/one1.log`), true)
  a.strictEqual(fs.existsSync(`${testDir}/one1`), false)
  a.strictEqual(fs.existsSync(`${testDir}/one2.log`), true)
  a.strictEqual(fs.existsSync(`${testDir}/one2`), false)
  process.argv = origArgv
})

runner.test('cli: --regexp, single replace', function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/ooo`)
  const origArgv = process.argv
  process.argv = [ 'node', 'test', '-f', '/o/', '-r', 'a', `${testDir}/*` ]
  const cliApp = new CliApp()
  cliApp.start()
  a.strictEqual(fs.existsSync(`${testDir}/aoo`), true)
  a.strictEqual(fs.existsSync(`${testDir}/ooo`), false)
  process.argv = origArgv
})

runner.test('cli: --regexp, global replace', function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/ooo`)
  const origArgv = process.argv
  process.argv = [ 'node', 'test', '-f', '/o/g', '-r', 'a', `${testDir}/*` ]
  const cliApp = new CliApp()
  cliApp.start()
  a.strictEqual(fs.existsSync(`${testDir}/aaa`), true)
  a.strictEqual(fs.existsSync(`${testDir}/ooo`), false)
  process.argv = origArgv
})

runner.test('cli: failed replace', function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/one`)
  createFixture(`${testDir}/two`)
  const origArgv = process.argv
  process.argv = [ 'node', 'test', '-f', 'one', '-r', 'two', `${testDir}/one` ]
  const cliApp = new CliApp()
  cliApp.start()
  a.strictEqual(fs.existsSync(`${testDir}/one`), true)
  a.strictEqual(fs.existsSync(`${testDir}/two`), true)
  a.strictEqual(process.exitCode, 1)
  process.exitCode = 0
  process.argv = origArgv
})
