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

runner.test('index plugin: simple', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath ],
    replace: '{{index}}'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/1`), true)
})

runner.test('index plugin: two files same depth, check index order matches input order', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/two`)
  const renamer = new Renamer()
  const options = {
    files: [ `${testFolder}/two`, `${testFolder}/one` ],
    find: /(.+)/,
    replace: '$1{{index}}'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/two`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/two1`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/one2`), true)
})

runner.test('index plugin: two files same depth, different order, check index order matches input order', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/two`)
  const renamer = new Renamer()
  const options = {
    files: [ `${testFolder}/one`, `${testFolder}/two` ],
    find: /(.+)/,
    replace: '$1{{index}}'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/two`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/one1`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/two2`), true)
})

runner.test('index plugin: with depth, check index order matches input order', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/dir/one`)
  createFixture(`${testFolder}/dir/two`)
  const renamer = new Renamer()
  const options = {
    files: [ `${testFolder}/one`, `${testFolder}/dir/one`, `${testFolder}/dir/two` ],
    find: 'e',
    replace: 'e{{index}}'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/two`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/one1`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/one2`), true)
})

runner.test('index plugin: with depth, different order, check index order matches input order', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  createFixture(`${testFolder}/one`)
  createFixture(`${testFolder}/dir/one`)
  createFixture(`${testFolder}/dir/two`)
  const renamer = new Renamer()
  const options = {
    files: [ `${testFolder}/dir/one`, `${testFolder}/one`, `${testFolder}/dir/two` ],
    find: 'e',
    replace: 'e{{index}}'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/two`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/dir/one1`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/one2`), true)
})

runner.test('index plugin: --index-root 10', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath ],
    replace: '{{index}}',
    indexRoot: 10
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/10`), true)
})

runner.test('index plugin: --index-root 10, two input files', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const fixturePath2 = createFixture(`${testFolder}/two`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath, fixturePath2 ],
    replace: '{{index}}',
    indexRoot: 10
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/two`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/10`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/11`), true)
})

runner.test('index plugin: --index-root 0', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath ],
    replace: '{{index}}',
    indexRoot: '0'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/0`), true)
})

runner.test('index plugin: --index-root 0 (type number)', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath ],
    replace: '{{index}}',
    indexRoot: 0
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/0`), true)
})

runner.test('index plugin: --index-root 0, two input files', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const fixturePath2 = createFixture(`${testFolder}/two`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath, fixturePath2 ],
    replace: '{{index}}',
    indexRoot: '0'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/two`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/0`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/1`), true)
})

runner.test('index plugin: --index-root 0 (type number), two input files', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const fixturePath2 = createFixture(`${testFolder}/two`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath, fixturePath2 ],
    replace: '{{index}}',
    indexRoot: 0
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/two`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/0`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/1`), true)
})

runner.test('index plugin: --index-root -10', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const fixturePath2 = createFixture(`${testFolder}/two`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath, fixturePath2 ],
    replace: '{{index}}',
    indexRoot: -10
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/two`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/-10`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/-9`), true)
})

runner.test('index plugin: --index-root -1, three input files', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const fixturePath2 = createFixture(`${testFolder}/two`)
  const fixturePath3 = createFixture(`${testFolder}/three`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath, fixturePath2, fixturePath3 ],
    replace: '{{index}}',
    indexRoot: '-1'
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/two`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/three`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/-1`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/0`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/1`), true)
})

runner.test('index plugin: --index-root -1 (type number), three input files', function () {
  const testFolder = path.join(sectionFolder, String(this.index))
  const fixturePath = createFixture(`${testFolder}/one`)
  const fixturePath2 = createFixture(`${testFolder}/two`)
  const fixturePath3 = createFixture(`${testFolder}/three`)
  const renamer = new Renamer()
  const options = {
    files: [ fixturePath, fixturePath2, fixturePath3 ],
    replace: '{{index}}',
    indexRoot: -1
  }
  renamer.rename(options)
  a.strictEqual(fs.existsSync(`${testFolder}/one`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/two`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/three`), false)
  a.strictEqual(fs.existsSync(`${testFolder}/-1`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/0`), true)
  a.strictEqual(fs.existsSync(`${testFolder}/1`), true)
})
