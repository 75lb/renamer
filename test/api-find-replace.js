import Renamer from 'renamer'
import { createFixture } from './lib/util.js'
import fs from 'fs'
import path from 'path'
import { strict as a } from 'assert'

const [test, only, skip] = [new Map(), new Map(), new Map()]
let index = 0

const testRoot = `tmp/${path.basename(import.meta.url)}`
fs.rmSync(testRoot, { recursive: true, force: true })

test.set('simple rename', async function () {
  index++
  const fixturePath = createFixture(`${testRoot}/${index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'o',
    replace: 'a'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${index}/one`), false)
  a.equal(fs.existsSync(`${testRoot}/${index}/ane`), true)
})

test.set('simple rename, just find-replace in the chain', async function () {
  index++
  const fixturePath = createFixture(`${testRoot}/${index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'o',
    replace: 'a',
    chain: 'find-replace'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${index}/one`), false)
  a.equal(fs.existsSync(`${testRoot}/${index}/ane`), true)
})

test.set('no find-replace in chain, not renamed', async function () {
  index++
  const fixturePath = createFixture(`${testRoot}/${index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'o',
    replace: 'a',
    chain: 'index-replace'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${index}/one`), true)
  a.equal(fs.existsSync(`${testRoot}/${index}/ane`), false)
})

test.set('nothing found', async function () {
  index++
  const fixturePath = createFixture(`${testRoot}/${index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'qqqq',
    replace: 'a'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${index}/one`), true)
})

test.set('target exists', async function () {
  index++
  const fixturePath = createFixture(`${testRoot}/${index}/one`)
  createFixture(`${testRoot}/${index}/two`)
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

test.set('target exists, force', async function () {
  index++
  const fixturePath = createFixture(`${testRoot}/${index}/one`)
  const fixturePath2 = createFixture(`${testRoot}/${index}/two`)
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

test.set("file doesn't exist: exception thrown", async function () {
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

test.set('simple rename, dry-run', async function () {
  index++
  const fixturePath = createFixture(`${testRoot}/${index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'o',
    replace: 'a',
    dryRun: true
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${index}/ane`), false)
  a.equal(fs.existsSync(`${testRoot}/${index}/one`), true)
})

test.set('empty result throws', async function () {
  index++
  const fixturePath = createFixture(`${testRoot}/${index}/one`)
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

skip.set('rename symlink')

test.set('depth-first renaming: renames deepest files first regardless or order supplied', async function () {
  index++
  const testDir = `${testRoot}/${index}`
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

test.set('path-element name', async function () {
  index++
  const fixturePath = createFixture(`${testRoot}/${index}/one.txt`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: /$/,
    replace: '-done',
    pathElement: 'name'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${index}/one.txt`), false)
  a.equal(fs.existsSync(`${testRoot}/${index}/one-done.txt`), true)
})

test.set('path-element ext', async function () {
  index++
  const fixturePath = createFixture(`${testRoot}/${index}/one.txt`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: /^\./,
    replace: '.done-',
    pathElement: 'ext'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testRoot}/${index}/one.txt`), false)
  a.equal(fs.existsSync(`${testRoot}/${index}/one.done-txt`), true)
})

export { test, only, skip }
