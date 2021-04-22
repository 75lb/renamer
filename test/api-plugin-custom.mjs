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

tom.test('simple', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/two`)
  let assertionCount = 0
  function plugin (Base) {
    return class Plugin extends Base {
      replace (filePath, options) {
        const file = path.parse(filePath)
        if (assertionCount === 0) {
          a.equal(filePath, `${testFolder}/one`)
          assertionCount++
          return `${file.dir}/test1`
        } else if (assertionCount === 1) {
          a.equal(filePath, `${testFolder}/two`)
          assertionCount++
          return `${file.dir}/test2`
        }
      }
    }
  }
  const renamer = new Renamer()
  const options = {
    files: [`${testFolder}/one`, `${testFolder}/two`],
    plugin: [plugin]
  }
  renamer.rename(options)
  a.equal(assertionCount, 2)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/two`), false)
  a.equal(fs.existsSync(`${testFolder}/test1`), true)
  a.equal(fs.existsSync(`${testFolder}/test2`), true)
})

tom.test('chain of two plugins', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  let assertionCount = 0
  function plugin1 (Base) {
    return class Plugin extends Base {
      replace (filePath, options) {
        a.equal(filePath, `${testFolder}/one`)
        assertionCount++
        return filePath + '1'
      }
    }
  }
  function plugin2 (Base) {
    return class Plugin extends Base {
      replace (filePath, options) {
        a.equal(filePath, `${testFolder}/one1`)
        assertionCount++
        return filePath + '2'
      }
    }
  }
  const renamer = new Renamer()
  const options = {
    files: [`${testFolder}/one`],
    plugin: [plugin1, plugin2]
  }
  renamer.rename(options)
  a.equal(assertionCount, 2)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/one1`), false)
  a.equal(fs.existsSync(`${testFolder}/one12`), true)
})

tom.test('invalid plugin, no .replace() function', function () {
  function plugin () {
    return class InvalidPlugin {}
  }
  const renamer = new Renamer()
  const options = {
    files: ['one'],
    plugin: [plugin]
  }
  a.throws(
    () => renamer.rename(options),
    /Invalid plugin/i
  )
})

tom.test('invalid plugin, no replace 2', function () {
  function plugin (Base) {
    return class InvalidPlugin extends Base {}
  }
  const renamer = new Renamer()
  const options = {
    files: ['one'],
    plugin: [plugin]
  }
  a.throws(
    () => renamer.rename(options),
    /not implemented/i
  )
})

tom.test('invalid plugin, not a function', function () {
  class InvalidPlugin {}
  const renamer = new Renamer()
  const options = {
    files: ['one'],
    plugin: [InvalidPlugin]
  }
  a.throws(
    () => renamer.rename(options),
    /Invalid plugin/i
  )
})

tom.test('invalid plugin, function doesn\'t return class', function () {
  function plugin () {}
  const renamer = new Renamer()
  const options = {
    files: ['one'],
    plugin: [plugin]
  }
  a.throws(
    () => renamer.rename(options),
    /Invalid plugin/i
  )
})

export default tom
