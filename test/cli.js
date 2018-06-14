'use strict'
const CliApp = require('../lib/cli-app')
const TestRunner = require('test-runner')
const a = require('assert')
const createFixture = require('./lib/util').createFixture
const fs = require('fs')
const rimraf = require('rimraf')

const runner = new TestRunner()
const testRoot = 'tmp/cli'
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
  process.argv = [ 'node', 'test', '--find', 'o.e', '--replace', 'yeah', fixturePath, '--regexp' ]
  const cliApp = new CliApp()
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  cliApp.start()
  process.argv = origArgv
  a.deepStrictEqual(fs.existsSync(fixturePath), false)
  a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

runner.test('cli: simple regexp, case sensitive', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/ONE`)
  const origArgv = process.argv
  process.argv = [ 'node', 'test', '--find', 'one', '--replace', 'yeah', fixturePath ]
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
  process.argv = [ 'node', 'test', '--find', 'one', '--replace', 'yeah', fixturePath, '--insensitive' ]
  const cliApp = new CliApp()
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  cliApp.start()
  process.argv = origArgv
  a.deepStrictEqual(fs.existsSync(fixturePath), false)
  a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

runner.test('cli: simple regexp, insensitive, regexp', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/ONE`)
  const origArgv = process.argv
  process.argv = [ 'node', 'test', '--find', 'one', '--replace', 'yeah', fixturePath, '--insensitive', '--regexp' ]
  const cliApp = new CliApp()
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  cliApp.start()
  process.argv = origArgv
  a.deepStrictEqual(fs.existsSync(fixturePath), false)
  a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

runner.skip('cli: no args, stdin files', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const origArgv = process.argv
  process.argv = [ 'node', 'test', '-f', 'one', '-r', 'two' ]
  const cliApp = new CliApp()
  cliApp.start()
  setTimeout(() => {
    process.stdin.write(fixturePath)
    a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/one`), false)
    a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/two`), true)
  }, 1000)
  process.argv = origArgv
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
