import ReplaceChain from '../../lib/replace-chain.js'
import path from 'path'
import { strict as a } from 'assert'

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('string find', async function () {
  const file = 'one'
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { find: 'one', replace: 'yeah' })
  a.deepEqual(result.from, 'one')
  a.deepEqual(result.to, 'yeah')
  a.deepEqual(result.renamed, true)
})

test.set('string find, sub-dir', async function () {
  const file = path.join('dir', 'one')
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { find: 'one', replace: 'yeah' })
  a.deepEqual(result.from, path.join('dir', 'one'))
  a.deepEqual(result.to, path.join('dir', 'yeah'))
  a.deepEqual(result.renamed, true)
})

test.set('regexp, sub-dir, unchanged', async function () {
  const file = path.join('one', 'two')
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { find: /one/g, replace: 'yeah' })
  a.deepEqual(result.from, path.join('one', 'two'))
  a.deepEqual(result.to, null)
  a.deepEqual(result.renamed, false)
})

test.set('regexp, sub-dir', async function () {
  const file = path.join('two', '/one one')
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { find: /one/g, replace: 'yeah' })
  a.deepEqual(result.from, path.join('two', '/one one'))
  a.deepEqual(result.to, path.join('two', 'yeah yeah'))
  a.deepEqual(result.renamed, true)
})

test.set('regexp', async function () {
  const file = 'one'
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { find: /one/g, replace: 'yeah' })
  a.deepEqual(result.from, 'one')
  a.deepEqual(result.to, 'yeah')
  a.deepEqual(result.renamed, true)
})

test.set('replace function', async function () {
  const file = 'one'
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { find: /one/g, replace: () => 'yeah' })
  a.deepEqual(result.from, 'one')
  a.deepEqual(result.to, 'yeah')
  a.deepEqual(result.renamed, true)
})

test.set('regexp, replace function', async function () {
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

test.set('empty find', async function () {
  const file = 'one'
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { replace: 'yeah' })
  a.deepEqual(result.from, 'one')
  a.deepEqual(result.to, 'yeah')
  a.deepEqual(result.renamed, true)
})

test.set('empty find, sub-directory', async function () {
  const file = path.join('one', 'one')
  const chain = new ReplaceChain()
  await chain.loadPlugins()
  const result = chain.replace(file, { replace: 'yeah' })
  a.deepEqual(result.from, path.join('one', 'one'))
  a.deepEqual(result.to, path.join('one', 'yeah'))
  a.deepEqual(result.renamed, true)
})

test.set('custom plugins', async function () {
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
  const result = chain.replace(file, { find: 'a', replace: 'b' }, 0, ['a-one-two'])
  a.deepEqual(result.from, file)
  a.deepEqual(result.to, 'a-{{one}}-2')
  a.deepEqual(result.renamed, true)
})

test.set('custom plugins plus a built-in', async function () {
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
  await chain.loadPlugins(['find-replace.js', PluginOne, PluginTwo])
  const result = chain.replace(file, { find: 'a', replace: 'b' }, 0, ['a-one-two'])
  a.deepEqual(result.from, file)
  a.deepEqual(result.to, 'b-{{one}}-2')
  a.deepEqual(result.renamed, true)
})

test.set('custom plugins plus a relative local path plugin', async function () {
  class PluginOne {
    replace (file) {
      return file.replace('index:', 'bindex:')
    }
  }
  const chain = new ReplaceChain()
  await chain.loadPlugins(['test/lib/dummy-plugin.js', PluginOne])
  const result = chain.replace('start', {}, 0, [])
  a.deepEqual(result.from, 'start')
  a.deepEqual(result.to, 'file: start, bindex: 0, file count: 0')
  a.deepEqual(result.renamed, true)
})

export { test, only, skip }
