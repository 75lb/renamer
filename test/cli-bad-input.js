const CliApp = require('../lib/cli-app')
const a = require('assert')
const createFixture = require('./lib/util').createFixture
const fs = require('fs')
const rimraf = require('rimraf')
const path = require('path')
const Tom = require('test-runner').Tom

const tom = module.exports = new Tom('cli-bad-input')
const testRoot = `tmp/${path.basename(__filename)}`
rimraf.sync(testRoot)

tom.test('invalid option: exit code set to 1, usage guide displayed, no file renamed', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const origArgv = process.argv
  const origCode = process.exitCode
  process.argv = [ 'node', 'test', '--find', 'one', '--replace', 'yeah', fixturePath, '--broken' ]
  const cliApp = new CliApp()
  const logs = []
  cliApp.log = function (...args) {
    logs.push(args)
  }
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  await cliApp.start()
  a.strictEqual(process.exitCode, 1)
  process.argv = origArgv
  process.exitCode = origCode
  a.deepStrictEqual(fs.existsSync(fixturePath), true)
  a.deepStrictEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), false)
  a.strictEqual(logs.length, 2)
  a.strictEqual(/Unknown option: --broken/.test(logs[0]), true)
  a.strictEqual(/For detailed instructions/.test(logs[1]), true)
})
