import CliApp from '../lib/cli-app.mjs'
import assert from 'assert'
import { createFixture } from './lib/util.mjs'
import rimraf from 'rimraf'
import fs from 'fs'
import path from 'path'
import TestRunner from 'test-runner'
import { spawn } from 'child_process'
const a = assert.strict
const tom = new TestRunner.Tom({ maxConcurrency: 1 })

const testRoot = `tmp/${path.basename(import.meta.url)}`
rimraf.sync(testRoot)

class TestCliApp extends CliApp {
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
  const cliApp = new TestCliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({
    argv: ['--find', 'one', '--replace', 'yeah', fixturePath]
  })
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('simple, dry run', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new TestCliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['--find', 'one', '--replace', 'yeah', fixturePath, '--dry-run'] })
  a.deepEqual(fs.existsSync(fixturePath), true)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), false)
})

tom.test('simple, using bin', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const origArgv = process.argv
  process.argv = ['--find', 'one', '--replace', 'yeah', fixturePath]
  a.deepEqual(fs.existsSync(fixturePath), true)
  const mod = await import('../bin/cli.mjs') // prints '✔︎ tmp/cli.js/3/one → tmp/cli.js/3/yeah'
  await mod.default
  process.argv = origArgv
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('simple, find string not found', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new TestCliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['--find', 'o.e', '--replace', 'yeah', fixturePath] })
  a.deepEqual(fs.existsSync(fixturePath), true)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), false)
})

tom.test('simple regexp', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new TestCliApp()
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/one`), true)
  await cliApp.start({ argv: ['--find', '/o.e/', '--replace', 'yeah', fixturePath] })
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/one`), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('simple regexp, case sensitive', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/ONE`)
  const cliApp = new TestCliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['--find', '/one/', '--replace', 'yeah', fixturePath] })
  a.deepEqual(fs.existsSync(fixturePath), true)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), false)
})

tom.test('simple regexp, insensitive', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/ONE`)
  const cliApp = new TestCliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['--find', '/one/i', '--replace', 'yeah', fixturePath] })
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('input file list on stdin', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = spawn('node', [path.join('bin', 'cli.mjs'), '-f', 'one', '-r', 'two'])
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
  const cliApp = new TestCliApp()
  let output = ''
  cliApp.log = function (msg) {
    output += msg
  }
  await cliApp.start({ argv: ['--help'] })
  a.equal(output.match(/Synopsis/g).length, 1)
})

tom.test('--regexp, append extention', async function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/one1`)
  createFixture(`${testDir}/one2`)
  const cliApp = new TestCliApp()
  await cliApp.start({ argv: ['-f', '/(.+)/', '-r', '$1.log', `${testDir}/*`] })
  a.equal(fs.existsSync(`${testDir}/one1.log`), true)
  a.equal(fs.existsSync(`${testDir}/one1`), false)
  a.equal(fs.existsSync(`${testDir}/one2.log`), true)
  a.equal(fs.existsSync(`${testDir}/one2`), false)
})

tom.test('--regexp, single replace', async function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/ooo`)
  const cliApp = new TestCliApp()
  await cliApp.start({ argv: ['-f', '/o/', '-r', 'a', `${testDir}/*`] })
  a.equal(fs.existsSync(`${testDir}/aoo`), true)
  a.equal(fs.existsSync(`${testDir}/ooo`), false)
})

tom.test('--regexp, global replace', async function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/ooo`)
  const cliApp = new TestCliApp()
  await cliApp.start({ argv: ['-f', '/o/g', '-r', 'a', `${testDir}/*`] })
  a.equal(fs.existsSync(`${testDir}/aaa`), true)
  a.equal(fs.existsSync(`${testDir}/ooo`), false)
})

tom.test('failed replace', async function () {
  const testDir = `${testRoot}/${this.index}`
  createFixture(`${testDir}/one`)
  createFixture(`${testDir}/two`)
  const cliApp = new TestCliApp()
  await cliApp.start({ argv: ['-f', 'one', '-r', 'two', `${testDir}/one`] })
  a.equal(fs.existsSync(`${testDir}/one`), true)
  a.equal(fs.existsSync(`${testDir}/two`), true)
  a.equal(process.exitCode, 1)
  process.exitCode = 0
})

tom.test('simple, diff view', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new TestCliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['--find', 'one', '--replace', 'yeah', fixturePath, '--view', 'diff'] })
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('simple, long view', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new TestCliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['--find', 'one', '--replace', 'yeah', fixturePath, '--view', 'long'] })
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah`), true)
})

tom.test('--index-root', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const cliApp = new TestCliApp()
  a.deepEqual(fs.existsSync(fixturePath), true)
  await cliApp.start({ argv: ['--index-root', '10', '--find', 'one', '--replace', 'yeah{{index}}', fixturePath] })
  a.deepEqual(fs.existsSync(fixturePath), false)
  a.deepEqual(fs.existsSync(`${testRoot}/${this.index}/yeah10`), true)
})

export default tom
