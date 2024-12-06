import Renamer from 'renamer'
import { createFixture } from './lib/util.js'
import fs from 'fs'
import path from 'path'
import { strict as a } from 'assert'

const [test, only, skip] = [new Map(), new Map(), new Map()]

const testRoot = `tmp/${path.basename(import.meta.url)}`
fs.rmSync(testRoot, { recursive: true, force: true })
let index = 1

test.set('arrayifies files', async function () {
  index++
  const fixturePath = createFixture(`${testRoot}/${index}/one`)
  const renamer = new Renamer()
  const options = {
    files: fixturePath,
    find: 'o',
    replace: 'a'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${index}/ane`), true)
})

test.set('empty plugin list defaults to [ default, index ]', async function () {
  index++
  const fixturePath = createFixture(`${testRoot}/${index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    plugin: [],
    find: 'o',
    replace: 'a'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${index}/ane`), true)
})

test.set('no find or replace input', async function () {
  const fixturePath = createFixture(`${testRoot}/${index++}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath]
  }
  await a.rejects(
    () => renamer.rename(options),
    /Please specify a value/i
  )
})

test.set('broken path-element', async function () {
  const fixturePath = createFixture(`${testRoot}/${index++}/one`)
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

test.set('replace result is an empty string', async function () {
  const fixturePath = createFixture(`${testRoot}/${index++}/one`)
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

test.set('replace result is an empty string 2', async function () {
  const fixturePath = createFixture(`${testRoot}/${index++}/one`)
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

export { test, only, skip }
