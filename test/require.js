const Renamer = require('renamer')
const a = require('assert').strict
const rimraf = require('rimraf')
const fs = require('fs')
const path = require('path')

async function asyncTom () {
  const { createFixture } = (await import('./lib/util.mjs'))
  const TestRunner = (await import('test-runner')).default
  const tom = new TestRunner.Tom()

  const testRoot = `tmp/${path.basename(__filename)}`
  rimraf.sync(testRoot)

  tom.test('CommonJS: simple rename', async function () {
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

  return tom
}

module.exports = asyncTom()
