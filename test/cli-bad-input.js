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

runner.test('cli: invalid option', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const origArgv = process.argv
  const origCode = process.exitCode
  process.argv = [ 'node', 'test', '--find', 'one', '--replace', 'yeah', fixturePath, '--broken' ]
  const cliApp = new CliApp()
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  cliApp.start()
  a.strictEqual(process.exitCode, 1)
  process.argv = origArgv
  process.exitCode = origCode
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), false)
})
