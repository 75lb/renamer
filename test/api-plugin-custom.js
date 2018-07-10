const Renamer = require('../')
const TestRunner = require('test-runner')
const a = require('assert')
const createFixture = require('./lib/util').createFixture
const rimraf = require('rimraf')
const fs = require('fs')
const path = require('path')

const runner = new TestRunner()

const sectionFolder = `tmp/${path.basename(__filename)}`
rimraf.sync(sectionFolder)

runner.test('custom plugin: simple', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/two`)
  let assertionCount = 0
  function plugin (Base) {
    return class Plugin extends Base {
      replace (filePath, options) {
        const file = this.parse(filePath)
        if (assertionCount === 0) {
          a.strictEqual(filePath, `${testFolder}/one`)
          assertionCount++
          return `${file.dirname}/test1`
        } else if (assertionCount === 1) {
          a.strictEqual(filePath, `${testFolder}/two`)
          assertionCount++
          return `${file.dirname}/test2`
        }
      }
    }
  }
  const renamer = new Renamer()
  const options = {
    files: [ `${testFolder}/one`, `${testFolder}/two` ],
    plugin: [ plugin ]
  }
  renamer.rename(options)
  a.strictEqual(assertionCount, 2)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/two`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/test1`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/test2`), true)
})

runner.test('custom plugin: chain of two plugins', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  let assertionCount = 0
  function plugin1 (Base) {
    return class Plugin extends Base {
      replace (filePath, options) {
        a.strictEqual(filePath, `${testFolder}/one`)
        assertionCount++
        return filePath + '1'
      }
    }
  }
  function plugin2 (Base) {
    return class Plugin extends Base {
      replace (filePath, options) {
        a.strictEqual(filePath, `${testFolder}/one1`)
        assertionCount++
        return filePath + '2'
      }
    }
  }
  const renamer = new Renamer()
  const options = {
    files: [ `${testFolder}/one` ],
    plugin: [ plugin1, plugin2 ]
  }
  renamer.rename(options)
  a.strictEqual(assertionCount, 2)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/one1`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/one12`), true)
})
