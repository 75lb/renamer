import Renamer from 'renamer'
import { createFixture } from './lib/util.js'
import fs from 'fs'
import path from 'path'
import { strict as a } from 'assert'

const [test, only, skip] = [new Map(), new Map(), new Map()]

const testRoot = `tmp/${path.basename(import.meta.url)}`
fs.rmSync(testRoot, { recursive: true, force: true })

test.set('simple', async function () {
  const testFolder = path.join(testRoot, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/two`)
  let assertionCount = 0
  class Plugin {
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
  const renamer = new Renamer()
  const options = {
    files: [`${testFolder}/one`, `${testFolder}/two`],
    chain: [Plugin]
  }
  await renamer.rename(options)
  a.equal(assertionCount, 2)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/two`), false)
  a.equal(fs.existsSync(`${testFolder}/test1`), true)
  a.equal(fs.existsSync(`${testFolder}/test2`), true)
})

test.set('chain of two plugins', async function () {
  const testFolder = path.join(testRoot, String(this.index))
  createFixture(`${testFolder}/one`)
  let assertionCount = 0
  class Plugin {
    replace (filePath, options) {
      a.equal(filePath, `${testFolder}/one`)
      assertionCount++
      return filePath + '1'
    }
  }
  class Plugin2 {
    replace (filePath, options) {
      a.equal(filePath, `${testFolder}/one1`)
      assertionCount++
      return filePath + '2'
    }
  }
  const renamer = new Renamer()
  const options = {
    files: [`${testFolder}/one`],
    chain: [Plugin, Plugin2]
  }
  await renamer.rename(options)
  a.equal(assertionCount, 2)
  a.equal(fs.existsSync(`${testFolder}/one`), false)
  a.equal(fs.existsSync(`${testFolder}/one1`), false)
  a.equal(fs.existsSync(`${testFolder}/one12`), true)
})

test.set('invalid plugin, no .replace() function', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  class InvalidPlugin {}
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    chain: [InvalidPlugin]
  }
  await a.rejects(
    () => renamer.rename(options),
    /Invalid plugin/i
  )
})

test.set('invalid plugin, function doesn\'t return class', async function () {
  const fixturePath = createFixture(`${testRoot}/${this.index}/one`)
  const InvalidPlugin = 0
  const renamer = new Renamer()
  const options = {
    files: [fixturePath],
    chain: [InvalidPlugin]
  }
  await a.rejects(
    () => renamer.rename(options),
    /Invalid plugin/i
  )
})

export { test, only, skip }
