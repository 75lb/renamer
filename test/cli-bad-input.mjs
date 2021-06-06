import CliApp from '../lib/cli-app.mjs'
import assert from 'assert'
import { createFixture } from './lib/util.mjs'
import rimraf from 'rimraf'
import fs from 'fs'
import path from 'path'
import TestRunner from 'test-runner'
import DefaultView from '../lib/view/default.mjs'
const a = assert.strict

const tom = new TestRunner.Tom()

const testRoot = `tmp/${path.basename(import.meta.url)}`
rimraf.sync(testRoot)

class TestView extends DefaultView {
  log (...args) {
    this.logs = this.logs || []
    this.logs.push(args)
  }

  logError (err) { // eslint-disable-line
    super.logError(err)
    /* Uncomment to print handled errors  */
    // console.error('ERROR', err)
  }
}

tom.test('invalid option: exit code set to 1, usage guide displayed, no file renamed', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const origCode = process.exitCode
  const logs = []
  const view = new DefaultView()
  view.log = function (...args) {
    logs.push(args)
  }
  const cliApp = new CliApp({ view })
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['node', 'test', '--find', 'one', '--replace', 'yeah', fixturePath, '--broken'] })
  a.equal(process.exitCode, 1)
  process.exitCode = origCode
  a.deepEqual(fs.existsSync(fixturePath), true)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), false)
  a.equal(logs.length, 2)
  a.equal(/Unknown option: --broken/.test(logs[0]), true)
  a.equal(/For detailed instructions/.test(logs[1]), true)
})

tom.test('--view: broken plugin', async function () {
  const origCode = process.exitCode
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const view = new TestView()
  const cliApp = new CliApp({ view })
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['-s', '--find', 'one', '--replace', 'yeah', fixturePath, '--view', './test/lib/broken-view.mjs'] })
  a.equal(cliApp.view.constructor.name, 'TestView')
  a.ok(/View must define a `write` method/.test(view.logs[0][0]))
  a.equal(process.exitCode, 1)
  process.exitCode = origCode
})

export default tom
