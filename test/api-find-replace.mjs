import Renamer from '../index.mjs'
import assert from 'assert'
import { createFixture } from './lib/util.mjs'
import rimraf from 'rimraf'
import fs from 'fs'
import path from 'path'
import TestRunner from 'test-runner'
const a = assert.strict

const tom = new TestRunner.Tom()

const testRoot = `tmp/${path.basename(import.meta.url)}`
rimraf.sync(testRoot)

tom.test('simple rename', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'o',
    replace: 'a'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${this.index}/one`), false)
  a.equal(fs.existsSync(`${testRoot}/${this.index}/ane`), true)
})

tom.test('simple rename, just find-replace in the chain', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'o',
    replace: 'a',
    chain: 'find-replace'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${this.index}/one`), false)
  a.equal(fs.existsSync(`${testRoot}/${this.index}/ane`), true)
})

tom.test('no find-replace in chain, not renamed', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'o',
    replace: 'a',
    chain: 'index-replace'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${this.index}/one`), true)
  a.equal(fs.existsSync(`${testRoot}/${this.index}/ane`), false)
})

tom.test('nothing found', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'qqqq',
    replace: 'a'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${this.index}/one`), true)
})

tom.test('target exists', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  createFixture(`${testRoot}/${this.index}/two`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'one',
    replace: 'two'
  }
  await a.rejects(
    () => renamer.rename(options),
    err => err.code === 'exists'
  )
})

tom.test('target exists, force', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const fixturePath2 = createFixture(`${testRoot}/${this.index}/two`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'one',
    replace: 'two',
    force: true
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(fixturePath), false)
  a.equal(fs.existsSync(fixturePath2), true)
})

tom.test("file doesn't exist: exception thrown", async function () {
  const renamer = new Renamer()
  const options = {
    files: ['asdfasfewf'],
    find: 'a',
    replace: 'e'
  }
  await a.rejects(
    () => renamer.rename(options),
    /do not exist/
  )
})

tom.test('simple rename, dry-run', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'o',
    replace: 'a',
    dryRun: true
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${this.index}/ane`), false)
  a.equal(fs.existsSync(`${testRoot}/${this.index}/one`), true)
})

tom.test('empty result throws', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'one',
    replace: ''
  }
  await a.rejects(
    () => renamer.rename(options),
    /empty/
  )
})

tom.todo('rename symlink')

tom.test('depth-first renaming: renames deepest files first regardless or order supplied', async function () {
  const testDir = `${testRoot}/${this.index}`
  const renamer = new Renamer()
  createFixture(`${testDir}/one/two`)
  createFixture(`${testDir}/one/four/two`)
  await renamer.rename({
    files: [`${testDir}/one`, `${testDir}/one/two`, `${testDir}/one/four`, `${testDir}/one/four/two`],
    find: 'o',
    replace: 'a'
  })
  a.equal(fs.existsSync(`${testDir}/one`), false)
  a.equal(fs.existsSync(`${testDir}/one/two`), false)
  a.equal(fs.existsSync(`${testDir}/ane`), true)
  a.equal(fs.existsSync(`${testDir}/ane/twa`), true)
})

tom.test('path-element name', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one.txt`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: /$/,
    replace: '-done',
    pathElement: 'name'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${this.index}/one.txt`), false)
  a.equal(fs.existsSync(`${testRoot}/${this.index}/one-done.txt`), true)
})

tom.test('path-element ext', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one.txt`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: /^\./,
    replace: '.done-',
    pathElement: 'ext'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${this.index}/one.txt`), false)
  a.equal(fs.existsSync(`${testRoot}/${this.index}/one.done-txt`), true)
})

export default tom
