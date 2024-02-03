import CliApp from '../lib/cli-app.js'
import assert from 'assert'
import { createFixture } from './lib/util.js'
import fs from 'fs'
import path from 'path'
import TestRunner from 'test-runner'
import { spawn } from 'child_process'
import DefaultView from '../lib/view/default.js'
import DiffView from '../lib/view/diff.js'
const a = assert.strict
const tom = new TestRunner.Tom({ maxConcurrency: 1 })

const testRoot = `tmp/${path.basename(import.meta.url)}`
fs.rmSync(testRoot, { recursive: true, force: true })

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

tom.test('simple', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new CliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({
    argv: ['-s', '--find', 'one', '--replace', 'yeah', fixturePath]
  })
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('simple, dry run', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new CliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['-s', '--find', 'one', '--replace', 'yeah', fixturePath, '--dry-run'] })
  a.deepEqual(fs.existsSync(fixturePath), true)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), false)
})

tom.test('simple, using bin', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const origArgv = process.argv
  process.argv = ['node', 'test.js', '-s', '--find', 'one', '--replace', 'yeah', fixturePath]
  a.deepEqual(fs.existsSync(fixturePath), true)
  const mod = await import('../bin/cli.js') // prints '✔︎ tmp/cli.js/3/one → tmp/cli.js/3/yeah'
  await mod.default
  process.argv = origArgv
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('simple, find string not found', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new CliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['-s', '--find', 'o.e', '--replace', 'yeah', fixturePath] })
  a.deepEqual(fs.existsSync(fixturePath), true)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), false)
})

tom.test('simple regexp', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new CliApp()
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/one`), true)
  await cliApp.start({ argv: ['-s', '--find', '/o.e/', '--replace', 'yeah', fixturePath] })
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/one`), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('simple regexp, case sensitive', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/ONE`)
  const cliApp = new CliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['-s', '--find', '/one/', '--replace', 'yeah', fixturePath] })
  a.deepEqual(fs.existsSync(fixturePath), true)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), false)
})

tom.test('simple regexp, insensitive', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/ONE`)
  const cliApp = new CliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['-s', '--find', '/one/i', '--replace', 'yeah', fixturePath] })
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('input file list on stdin', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = spawn('node', [path.join('bin', 'cli.js'), '-f', 'one', '-r', 'two', '-s'])
  return new Promise((resolve, reject) => {
    renamer.on('close', () => {
      a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/one`), false)
      a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/two`), true)
      resolve()
    })
    renamer.stdin.end(fixturePath)
  })
})

tom.test('--help', async function () {
  let output = ''
  const testView = new TestView()
  testView.log = function (msg) {
    output += msg
  }
  const cliApp = new CliApp({ view: testView })
  await cliApp.start({ argv: ['--help'] })
  a.equal(output.match(/Synopsis/g).length, 1)
})

tom.test('--regexp, append extention', async function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/one1`)
  createFixture(`${testDir}/one2`)
  const cliApp = new CliApp()
  await cliApp.start({ argv: ['-s', '-f', '/(.+)/', '-r', '$1.log', `${testDir}/*`] })
  a.equal(fs.existsSync(`${testDir}/one1.log`), true)
  a.equal(fs.existsSync(`${testDir}/one1`), false)
  a.equal(fs.existsSync(`${testDir}/one2.log`), true)
  a.equal(fs.existsSync(`${testDir}/one2`), false)
})

tom.test('--regexp, single replace', async function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/ooo`)
  const cliApp = new CliApp()
  await cliApp.start({ argv: ['-s', '-f', '/o/', '-r', 'a', `${testDir}/*`] })
  a.equal(fs.existsSync(`${testDir}/aoo`), true)
  a.equal(fs.existsSync(`${testDir}/ooo`), false)
})

tom.test('--regexp, global replace', async function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/ooo`)
  const cliApp = new CliApp()
  await cliApp.start({ argv: ['-s', '-f', '/o/g', '-r', 'a', `${testDir}/*`] })
  a.equal(fs.existsSync(`${testDir}/aaa`), true)
  a.equal(fs.existsSync(`${testDir}/ooo`), false)
})

tom.test('failed replace', async function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/one`)
  createFixture(`${testDir}/two`)
  const cliApp = new CliApp()
  await cliApp.start({ argv: ['-s', '-f', 'one', '-r', 'two', `${testDir}/one`] })
  a.equal(fs.existsSync(`${testDir}/one`), true)
  a.equal(fs.existsSync(`${testDir}/two`), true)
  a.equal(process.exitCode, 1)
  process.exitCode = 0
})

tom.test('simple, pass custom view to constructor', async function () {
  class TestDiffView extends DiffView {
    log (...args) {
      this.logs = this.logs || []
      this.logs.push(args)
    }
  }

  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new CliApp({ view: new TestDiffView() })
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['--find', 'one', '--replace', 'yeah', fixturePath] })
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('--view long', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new CliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['-s', '--find', 'one', '--replace', 'yeah', fixturePath, '--view', 'long'] })
  a.equal(cliApp.view.constructor.name, 'LongView')
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('--view diff', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new CliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['-s', '--find', 'one', '--replace', 'yeah', fixturePath, '--view', 'diff'] })
  a.equal(cliApp.view.constructor.name, 'DiffView')
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('--view one-line', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new CliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['-s', '--find', 'one', '--replace', 'yeah', fixturePath, '--view', 'one-line'] })
  a.equal(cliApp.view.constructor.name, 'OneLineView')
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('--view: load plugin', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new CliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['-s', '--find', 'one', '--replace', 'yeah', fixturePath, '--view', './test/lib/dummy-view.js'] })
  a.equal(cliApp.view.constructor.name, 'DummyView')
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('--index-root', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new CliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['-s', '--index-root', '10', '--find', 'one', '--replace', 'yeah{{index}}', fixturePath] })
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah10`), true)
})

tom.test('--chain built-in', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new CliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['-s', '--chain', 'find-replace.js', '--find', 'one', '--replace', 'yeah', fixturePath] })
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('--chain built-in local --help', async function () {
  const cliApp = new CliApp({ view: new TestView() })
  await cliApp.start({
    argv: ['--chain', 'find-replace.js', '--chain', './test/lib/dummy-plugin.js', '--help']
  })
  a.ok(/FindReplace/.test(cliApp.view.logs[0][0]))
  a.ok(/DummyPlugin/.test(cliApp.view.logs[0][0]))
})

tom.test('--chain: local plugin package', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one-file`)
  const cliApp = new CliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['-s', '--chain', 'renamer-case', '--case', 'camel', fixturePath] })
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/oneFile`), true)
})

tom.test('--silent, view logging is not invoked', async function () {
  const view = new TestView()
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new CliApp({ view })
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['--find', 'one', '--replace', 'yeah', fixturePath, '--silent'] })
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('--verbose also shows non-renamed logs', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new CliApp({ view: new TestView() })
  /* verbose not set - nothing logged */
  await cliApp.start({
    argv: ['--find', 'asdf', '--replace', 'yeah', fixturePath]
  })
  a.equal(cliApp.view.logs.length, 1)
  cliApp.view.logs = []
  /* verbose set - log present */
  await cliApp.start({
    argv: ['--find', 'asdf', '--replace', 'yeah', fixturePath, '--verbose']
  })
  a.equal(cliApp.view.logs.length, 2)
})

export default tom
