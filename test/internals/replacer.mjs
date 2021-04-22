import Replacer from '../../lib/replacer.mjs'
import assert from 'assert'
import path from 'path'
import TestRunner from 'test-runner'
const a = assert.strict

const tom = new TestRunner.Tom()

tom.test('string find', function () {
  const file = 'one'
  const replacer = new Replacer()
  const result = replacer.replace(file, { find: 'one', replace: 'yeah' })
  a.deepEqual(result.from, 'one')
  a.deepEqual(result.to, 'yeah')
  a.deepEqual(result.renamed, true)
})

tom.test('string find, sub-dir', function () {
  const file = path.join('dir', 'one')
  const replacer = new Replacer()
  const result = replacer.replace(file, { find: 'one', replace: 'yeah' })
  a.deepEqual(result.from, path.join('dir', 'one'))
  a.deepEqual(result.to, path.join('dir', 'yeah'))
  a.deepEqual(result.renamed, true)
})

tom.test('regexp, sub-dir, unchanged', function () {
  const file = path.join('one', 'two')
  const replacer = new Replacer()
  const result = replacer.replace(file, { find: /one/g, replace: 'yeah' })
  a.deepEqual(result.from, path.join('one', 'two'))
  a.deepEqual(result.to, null)
  a.deepEqual(result.renamed, false)
})

tom.test('regexp, sub-dir', function () {
  const file = path.join('two', '/one one')
  const replacer = new Replacer()
  const result = replacer.replace(file, { find: /one/g, replace: 'yeah' })
  a.deepEqual(result.from, path.join('two', '/one one'))
  a.deepEqual(result.to, path.join('two', 'yeah yeah'))
  a.deepEqual(result.renamed, true)
})

tom.test('regexp', function () {
  const file = 'one'
  const replacer = new Replacer()
  const result = replacer.replace(file, { find: /one/g, replace: 'yeah' })
  a.deepEqual(result.from, 'one')
  a.deepEqual(result.to, 'yeah')
  a.deepEqual(result.renamed, true)
})

tom.test('replace function', function () {
  const file = 'one'
  const replacer = new Replacer()
  const result = replacer.replace(file, { find: /one/g, replace: () => 'yeah' })
  a.deepEqual(result.from, 'one')
  a.deepEqual(result.to, 'yeah')
  a.deepEqual(result.renamed, true)
})

tom.test('regexp, replace function', function () {
  const file = 'one-two'
  const replacer = new Replacer()
  const result = replacer.replace(file, {
    find: /(\w+)-(\w+)/,
    replace: function (match, p1, p2) {
      return `${p1}__${p2}`
    }
  })
  a.deepEqual(result.from, 'one-two')
  a.deepEqual(result.to, 'one__two')
  a.deepEqual(result.renamed, true)
})

tom.test('empty find', function () {
  const file = 'one'
  const replacer = new Replacer()
  const result = replacer.replace(file, { replace: 'yeah' })
  a.deepEqual(result.from, 'one')
  a.deepEqual(result.to, 'yeah')
  a.deepEqual(result.renamed, true)
})

tom.test('empty find, sub-directory', function () {
  const file = path.join('one', 'one')
  const replacer = new Replacer()
  const result = replacer.replace(file, { replace: 'yeah' })
  a.deepEqual(result.from, path.join('one', 'one'))
  a.deepEqual(result.to, path.join('one', 'yeah'))
  a.deepEqual(result.renamed, true)
})

tom.test('custom plugins', function () {
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
  const replacer = new Replacer([pluginOne, pluginTwo])
  const result = replacer.replace(file, { find: 'a', replace: 'b' })
  a.deepEqual(result.from, file)
  a.deepEqual(result.to, 'a-{{one}}-2')
  a.deepEqual(result.renamed, true)
})

tom.test('plugins plus a built-in', function () {
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
  const replacer = new Replacer(['default', pluginOne, pluginTwo])
  const result = replacer.replace(file, { find: 'a', replace: 'b' })
  a.deepEqual(result.from, file)
  a.deepEqual(result.to, 'b-{{one}}-2')
  a.deepEqual(result.renamed, true)
})

export default tom
