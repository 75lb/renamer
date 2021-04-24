import Renamer from '../index.mjs'
import assert from 'assert'
import { createFixture } from './lib/util.mjs'
import rimraf from 'rimraf'
import fs from 'fs'
import path from 'path'
import TestRunner from 'test-runner'
const a = assert.strict

const tom = new TestRunner.Tom()

const sectionFolder = `tmp/${path.basename(import.meta.url)}`
rimraf.sync(sectionFolder)

tom.test('simple', async function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    replace: '{{index}}'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/1`), true)
})

tom.test('two files same depth, check index order matches input order', async function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/two`)
  const renamer = new Renamer()
  const options = {
    files: [`${testFolder}/two`, `${testFolder}/one`],
    find: /(.+)/,
    replace: '$1{{index}}'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/two`), false)
  a.equal(fs.existsSync(`${testFolder}/two1`), true)
  a.equal(fs.existsSync(`${testFolder}/one2`), true)
})

tom.test('two files same depth, different order, check index order matches input order', async function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/two`)
  const renamer = new Renamer()
  const options = {
    files: [`${testFolder}/one`, `${testFolder}/two`],
    find: /(.+)/,
    replace: '$1{{index}}'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/two`), false)
  a.equal(fs.existsSync(`${testFolder}/one1`), true)
  a.equal(fs.existsSync(`${testFolder}/two2`), true)
})

tom.test('with depth, check index order matches input order', async function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/dir/one`)
  createFixture(`${testFolder}/dir/two`)
  const renamer = new Renamer()
  const options = {
    files: [`${testFolder}/one`, `${testFolder}/dir/one`, `${testFolder}/dir/two`],
    find: 'e',
    replace: 'e{{index}}'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/dir/one`), false)
  a.equal(fs.existsSync(`${testFolder}/dir/two`), true)
  a.equal(fs.existsSync(`${testFolder}/one1`), true)
  a.equal(fs.existsSync(`${testFolder}/dir/one2`), true)
})

tom.test('with depth, different order, check index order matches input order', async function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/dir/one`)
  createFixture(`${testFolder}/dir/two`)
  const renamer = new Renamer()
  const options = {
    files: [`${testFolder}/dir/one`, `${testFolder}/one`, `${testFolder}/dir/two`],
    find: 'e',
    replace: 'e{{index}}'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/dir/one`), false)
  a.equal(fs.existsSync(`${testFolder}/dir/two`), true)
  a.equal(fs.existsSync(`${testFolder}/dir/one1`), true)
  a.equal(fs.existsSync(`${testFolder}/one2`), true)
})

tom.test('--index-root 10', async function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    replace: '{{index}}',
    indexRoot: 10
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/10`), true)
})

tom.test('--index-root 10, two input files', async function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const fixturePath2 = createFixture(`${testFolder}/two`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath, fixturePath2],
    replace: '{{index}}',
    indexRoot: 10
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/two`), false)
  a.equal(fs.existsSync(`${testFolder}/10`), true)
  a.equal(fs.existsSync(`${testFolder}/11`), true)
})

tom.test('--index-root 0', async function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    replace: '{{index}}',
    indexRoot: '0'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/0`), true)
})

tom.test('--index-root 0 (type number)', async function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    replace: '{{index}}',
    indexRoot: 0
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/0`), true)
})

tom.test('--index-root 0, two input files', async function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const fixturePath2 = createFixture(`${testFolder}/two`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath, fixturePath2],
    replace: '{{index}}',
    indexRoot: '0'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/two`), false)
  a.equal(fs.existsSync(`${testFolder}/0`), true)
  a.equal(fs.existsSync(`${testFolder}/1`), true)
})

tom.test('--index-root 0 (type number), two input files', async function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const fixturePath2 = createFixture(`${testFolder}/two`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath, fixturePath2],
    replace: '{{index}}',
    indexRoot: 0
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/two`), false)
  a.equal(fs.existsSync(`${testFolder}/0`), true)
  a.equal(fs.existsSync(`${testFolder}/1`), true)
})

tom.test('--index-root -10', async function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const fixturePath2 = createFixture(`${testFolder}/two`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath, fixturePath2],
    replace: '{{index}}',
    indexRoot: -10
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/two`), false)
  a.equal(fs.existsSync(`${testFolder}/-10`), true)
  a.equal(fs.existsSync(`${testFolder}/-9`), true)
})

tom.test('--index-root -1, three input files', async function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const fixturePath2 = createFixture(`${testFolder}/two`)
  const fixturePath3 = createFixture(`${testFolder}/three`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath, fixturePath2, fixturePath3],
    replace: '{{index}}',
    indexRoot: '-1'
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/two`), false)
  a.equal(fs.existsSync(`${testFolder}/three`), false)
  a.equal(fs.existsSync(`${testFolder}/-1`), true)
  a.equal(fs.existsSync(`${testFolder}/0`), true)
  a.equal(fs.existsSync(`${testFolder}/1`), true)
})

tom.test('--index-root -1 (type number), three input files', async function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const fixturePath2 = createFixture(`${testFolder}/two`)
  const fixturePath3 = createFixture(`${testFolder}/three`)
  const renamer = new Renamer()
  const options = {
    files: [fixturePath, fixturePath2, fixturePath3],
    replace: '{{index}}',
    indexRoot: -1
  }
  await renamer.rename(options)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/two`), false)
  a.equal(fs.existsSync(`${testFolder}/three`), false)
  a.equal(fs.existsSync(`${testFolder}/-1`), true)
  a.equal(fs.existsSync(`${testFolder}/0`), true)
  a.equal(fs.existsSync(`${testFolder}/1`), true)
})

export default tom
