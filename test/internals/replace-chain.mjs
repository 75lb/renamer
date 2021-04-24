import ReplaceChain from '../../lib/replace-chain.mjs'
import assert from 'assert'
import path from 'path'
import TestRunner from 'test-runner'
const a = assert.strict

const tom = new TestRunner.Tom()

tom.test('string find', async function () {
  const file = 'one'
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { find: 'one', replace: 'yeah' })
  a.deepEqual(result.from, 'one')
  a.deepEqual(result.to, 'yeah')
  a.deepEqual(result.renamed, true)
})

tom.test('string find, sub-dir', async function () {
  const file = path.join('dir', 'one')
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { find: 'one', replace: 'yeah' })
  a.deepEqual(result.from, path.join('dir', 'one'))
  a.deepEqual(result.to, path.join('dir', 'yeah'))
  a.deepEqual(result.renamed, true)
})

tom.test('regexp, sub-dir, unchanged', async function () {
  const file = path.join('one', 'two')
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { find: /one/g, replace: 'yeah' })
  a.deepEqual(result.from, path.join('one', 'two'))
  a.deepEqual(result.to, null)
  a.deepEqual(result.renamed, false)
})

tom.test('regexp, sub-dir', async function () {
  const file = path.join('two', '/one one')
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { find: /one/g, replace: 'yeah' })
  a.deepEqual(result.from, path.join('two', '/one one'))
  a.deepEqual(result.to, path.join('two', 'yeah yeah'))
  a.deepEqual(result.renamed, true)
})

tom.test('regexp', async function () {
  const file = 'one'
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { find: /one/g, replace: 'yeah' })
  a.deepEqual(result.from, 'one')
  a.deepEqual(result.to, 'yeah')
  a.deepEqual(result.renamed, true)
})

tom.test('replace function', async function () {
  const file = 'one'
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { find: /one/g, replace: () => 'yeah' })
  a.deepEqual(result.from, 'one')
  a.deepEqual(result.to, 'yeah')
  a.deepEqual(result.renamed, true)
})

tom.test('regexp, replace function', async function () {
  const file = 'one-two'
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, {
    find: /(\w+)-(\w+)/,
    replace: function (match, p1, p2) {
      return `${p1}__${p2}`
    }
  })
  a.deepEqual(result.from, 'one-two')
  a.deepEqual(result.to, 'one__two')
  a.deepEqual(result.renamed, true)
})

tom.test('empty find', async function () {
  const file = 'one'
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { replace: 'yeah' })
  a.deepEqual(result.from, 'one')
  a.deepEqual(result.to, 'yeah')
  a.deepEqual(result.renamed, true)
})

tom.test('empty find, sub-directory', async function () {
  const file = path.join('one', 'one')
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { replace: 'yeah' })
  a.deepEqual(result.from, path.join('one', 'one'))
  a.deepEqual(result.to, path.join('one', 'yeah'))
  a.deepEqual(result.renamed, true)
})

tom.test('custom plugins', async function () {
  class PluginOne {
    replace (file) {
      return file.replace('one', '{{one}}')
    }
  }
  class PluginTwo {
    replace (file) {
      return file.replace('two', '2')
    }
  }
  const file = 'a-one-two'
  const chain = new ReplaceChain()
  await chain.loadPlugins([PluginOne, PluginTwo])
  const result = chain.replace(file, { find: 'a', replace: 'b' })
  a.deepEqual(result.from, file)
  a.deepEqual(result.to, 'a-{{one}}-2')
  a.deepEqual(result.renamed, true)
})

tom.test('custom plugins plus a built-in', async function () {
  class PluginOne {
    replace (file) {
      return file.replace('one', '{{one}}')
    }
  }
  class PluginTwo {
    replace (file) {
      return file.replace('two', '2')
    }
  }
  const file = 'a-one-two'
  const chain = new ReplaceChain()
  await chain.loadPlugins(['default-replace.mjs', PluginOne, PluginTwo])
  const result = chain.replace(file, { find: 'a', replace: 'b' })
  a.deepEqual(result.from, file)
  a.deepEqual(result.to, 'b-{{one}}-2')
  a.deepEqual(result.renamed, true)
})

tom.test('custom plugins plus a relative local path plugin', async function () {
  class PluginOne {
    replace (file) {
      return file.replace('one', '{{one}}')
    }
  }
  class PluginTwo {
    replace (file) {
      return file.replace('two', '2')
    }
  }
  const file = 'a-one-two'
  const chain = new ReplaceChain()
  await chain.loadPlugins(['test/lib/dummy-plugin.mjs', PluginOne, PluginTwo])
  const result = chain.replace(file, { find: 'a', replace: 'b' })
  a.deepEqual(result.from, file)
  a.deepEqual(result.to, 'ok')
  a.deepEqual(result.renamed, true)
})

export default tom
