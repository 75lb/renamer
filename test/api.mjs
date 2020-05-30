import Renamer from '../index.mjs'
import a from 'assert'
import { createFixture } from './lib/util.mjs'
import rimraf from 'rimraf'
import fs from 'fs'
import path from 'path'
import TestRunner from 'test-runner'

const tom = new TestRunner.Tom()

const testRoot = `tmp/${path.basename(import.meta.url)}`
rimraf.sync(testRoot)

tom.test('simple rename', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'o',
    replace: 'a'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testRoot}/${this.index}/one`), false)
  a.strictEqual(fs.existsSync(`${testRoot}/${this.index}/ane`), true)
})

tom.test('nothing found', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'qqqq',
    replace: 'a'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testRoot}/${this.index}/one`), true)
})

tom.test('target exists', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  createFixture(`${testRoot}/${this.index}/two`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'one',
    replace: 'two'
  }
  a.throws(
    () => renamer.rename(options),
    err => err.code === 'exists'
  )
})

tom.test('target exists, force', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const fixturePath2 = createFixture(`${testRoot}/${this.index}/two`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'one',
    replace: 'two',
    force: true
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(fixturePath), false)
  a.strictEqual(fs.existsSync(fixturePath2), true)
})

tom.test("file doesn't exist", function () {
  const renamer = new Renamer()
  const options = {
    files: ['asdfasfewf'],
    find: 'a',
    replace: 'e'
  }
  a.throws(
    () => renamer.rename(options),
    /ENOENT/
  )
})

tom.test('simple rename, dry-run', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'o',
    replace: 'a',
    dryRun: true
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testRoot}/${this.index}/ane`), false)
  a.strictEqual(fs.existsSync(`${testRoot}/${this.index}/one`), true)
})

tom.test('empty result throws', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: 'one',
    replace: ''
  }
  a.throws(
    () => renamer.rename(options),
    /empty/
  )
})

tom.todo('rename symlink')

tom.test('depth-first renaming', function () {
  const testDir = `${testRoot}/${this.index}`
  const renamer = new Renamer()
  createFixture(`${testDir}/one/two`)
  renamer.rename({ files: [`${testDir}/one`, `${testDir}/one/two`], find: 'o', replace: 'a' })
  a.strictEqual(fs.existsSync(`${testDir}/one`), false)
  a.strictEqual(fs.existsSync(`${testDir}/one/two`), false)
  a.strictEqual(fs.existsSync(`${testDir}/ane`), true)
  a.strictEqual(fs.existsSync(`${testDir}/ane/twa`), true)
})

tom.test('path-element name', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one.txt`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: /$/,
    replace: '-done',
    pathElement: 'name'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testRoot}/${this.index}/one.txt`), false)
  a.strictEqual(fs.existsSync(`${testRoot}/${this.index}/one-done.txt`), true)
})

tom.test('path-element ext', function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one.txt`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    find: /^\./,
    replace: '.done-',
    pathElement: 'ext'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testRoot}/${this.index}/one.txt`), false)
  a.strictEqual(fs.existsSync(`${testRoot}/${this.index}/one.done-txt`), true)
})

export default tom
