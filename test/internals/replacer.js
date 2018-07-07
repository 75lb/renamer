'use strict'
const Replacer = require('../../lib/replacer')
const TestRunner = require('test-runner')
const a = require('assert')

const runner = new TestRunner()

runner.test('replacer: string find', function () {
  const file = 'one'
  const replacer = new Replacer()
  const result = replacer.replace(file, { find: 'one', replace: 'yeah' })
  a.deepStrictEqual(result.from, 'one')
  a.deepStrictEqual(result.to, 'yeah')
  a.deepStrictEqual(result.renamed, true)
})

runner.test('replacer: string find, sub-dir', function () {
  const file = 'dir/one'
  const replacer = new Replacer()
  const result = replacer.replace(file, { find: 'one', replace: 'yeah' })
  a.deepStrictEqual(result.from, 'dir/one')
  a.deepStrictEqual(result.to, 'dir/yeah')
  a.deepStrictEqual(result.renamed, true)
})

runner.test('replacer: regexp, sub-dir, unchanged', function () {
  const file = 'one/two'
  const replacer = new Replacer()
  const result = replacer.replace(file, { find: /one/g, replace: 'yeah' })
  a.deepStrictEqual(result.from, 'one/two')
  a.deepStrictEqual(result.to, null)
  a.deepStrictEqual(result.renamed, false)
})

runner.test('replacer: regexp, sub-dir', function () {
  const file = 'two/one one'
  const replacer = new Replacer()
  const result = replacer.replace(file, { find: /one/g, replace: 'yeah' })
  a.deepStrictEqual(result.from, 'two/one one')
  a.deepStrictEqual(result.to, 'two/yeah yeah')
  a.deepStrictEqual(result.renamed, true)
})

runner.test('replacer: regexp', function () {
  const file = 'one'
  const replacer = new Replacer()
  const result = replacer.replace(file, { find: /one/g, replace: 'yeah' })
  a.deepStrictEqual(result.from, 'one')
  a.deepStrictEqual(result.to, 'yeah')
  a.deepStrictEqual(result.renamed, true)
})

runner.test('replacer: replace function', function () {
  const file = 'one'
  const replacer = new Replacer()
  const result = replacer.replace(file, { find: /one/g, replace: () => 'yeah' })
  a.deepStrictEqual(result.from, 'one')
  a.deepStrictEqual(result.to, 'yeah')
  a.deepStrictEqual(result.renamed, true)
})

runner.test('replacer: regexp, replace function', function () {
  const file = 'one-two'
  const replacer = new Replacer()
  const result = replacer.replace(file, { find: /(\w+)-(\w+)/,  replace: function (match, p1, p2) {
    return `${p1}__${p2}`
  }})
  a.deepStrictEqual(result.from, 'one-two')
  a.deepStrictEqual(result.to, 'one__two')
  a.deepStrictEqual(result.renamed, true)
})

runner.test('replacer: empty find', function () {
  const file = 'one'
  const replacer = new Replacer()
  const result = replacer.replace(file, { replace: 'yeah' })
  a.deepStrictEqual(result.from, 'one')
  a.deepStrictEqual(result.to, 'yeah')
  a.deepStrictEqual(result.renamed, true)
})

runner.test('replacer: empty find, sub-directory', function () {
  const file = 'one/one'
  const replacer = new Replacer()
  const result = replacer.replace(file, { replace: 'yeah' })
  a.deepStrictEqual(result.from, 'one/one')
  a.deepStrictEqual(result.to, 'one/yeah')
  a.deepStrictEqual(result.renamed, true)
})

runner.test('replacer: custom plugins', function () {
  function pluginOne (PluginBase) {
    return class extends PluginBase {
      replace (file) {
        return file.replace('one', '{{one}}')
      }
    }
  }
  function pluginTwo (PluginBase) {
    return class extends PluginBase {
      replace (file) {
        return file.replace('two', '2')
      }
    }
  }
  const file = 'a-one-two'
  const replacer = new Replacer([ pluginOne, pluginTwo ])
  const result = replacer.replace(file, { find: 'a', replace: 'b' })
  a.deepStrictEqual(result.from, file)
  a.deepStrictEqual(result.to, 'a-{{one}}-2')
  a.deepStrictEqual(result.renamed, true)
})

runner.test('replacer: plugins plus a built-in', function () {
  function pluginOne (PluginBase) {
    return class extends PluginBase {
      replace (file) {
        return file.replace('one', '{{one}}')
      }
    }
  }
  function pluginTwo (PluginBase) {
    return class extends PluginBase {
      replace (file) {
        return file.replace('two', '2')
      }
    }
  }
  const file = 'a-one-two'
  const replacer = new Replacer([ 'default', pluginOne, pluginTwo ])
  const result = replacer.replace(file, { find: 'a', replace: 'b' })
  a.deepStrictEqual(result.from, file)
  a.deepStrictEqual(result.to, 'b-{{one}}-2')
  a.deepStrictEqual(result.renamed, true)
})
