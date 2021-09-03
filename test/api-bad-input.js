import Renamer from 'renamer'
import assert from 'assert'
import { createFixture } from './lib/util.js'
import rimraf from 'rimraf'
import fs from 'fs'
import path from 'path'
import TestRunner from 'test-runner'
const a = assert.strict

const tom = new TestRunner.Tom()

const testRoot = `tmp/${path.basename(import.meta.url)}`
rimraf.sync(testRoot)

tom.test('arrayifies files', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: fixturePath,
    find: 'o',
    replace: 'a'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${this.index}/ane`), true)
})

tom.test('empty plugin list defaults to [ default, index ]', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    plugin: [],
    find: 'o',
    replace: 'a'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${this.index}/ane`), true)
})

tom.test('no find or replace input', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath]
  }
  await a.rejects(
    () => renamer.rename(options),
    /Please specify a value/i
  )
})

tom.test('broken path-element', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'one',
    replace: 'two',
    pathElement: 'broken'
  }
  await a.rejects(
    () => renamer.rename(options),
    /Invalid path element/i
  )
})

tom.test('replace result is an empty string', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'one',
    replace: ''
  }
  await a.rejects(
    () => renamer.rename(options),
    /Replace resulted in empty filename./i
  )
})

tom.test('replace result is an empty string 2', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'one',
    replace: '',
    pathElement: 'name'
  }
  await a.rejects(
    () => renamer.rename(options),
    /Replace resulted in empty filename./i
  )
})

export default tom
