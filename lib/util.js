/**
 * Convert a string like `/something/g` to a RegExp instance.
 */
function regExpBuilder (find) {
  const regExpRe = /\/(.*)\/(\w*)/
  if (find) {
    if (regExpRe.test(find)) {
      const matches = find.match(regExpRe)
      const pattern = matches[1]
      const flags = matches[2]
      return new RegExp(pattern, flags)
    } else {
      return find
    }
  } else {
    return null
  }
}

function expandGlobPatterns (files) {
  const glob = require('glob')
  const flatten = require('reduce-flatten')
  const unique = require('reduce-unique')
  return files
    .map(file => glob.hasMagic(file) ? glob.sync(file, { nonull: true }) : file)
    .reduce(flatten, [])
    .reduce(unique, [])
}

function depthFirstSort (files) {
  return files.sort(this.depthFirstCompare)
}

function depthFirstCompare (a, b) {
  const path = require('path')
  a = path.normalize(a)
  b = path.normalize(b)
  const depth = {
    a: a.split(path.sep).length,
    b: b.split(path.sep).length
  }
  if (depth.a > depth.b) {
    return -1
  } if (depth.a === depth.b) {
    return 0
  } else {
    return 1
  }
}

function loadPlugins (pluginNames) {
  const path = require('path')
  const arrayify = require('array-back')
  const t = require('typical')
  return arrayify(pluginNames).map(pluginName => {
    let createPlugin
    if (typeof pluginName === 'string') {
      const loadModule = require('load-module')
      const globalModules = require('global-modules')
      createPlugin = loadModule(pluginName, {
        paths: [ path.resolve(__dirname, 'plugin'), '.', globalModules ],
        prefix: 'renamer-'
      })
    } else {
      createPlugin = pluginName
    }
    if (!(typeof createPlugin === 'function' && !t.isClass(createPlugin))) {
      throw new Error('Invalid plugin: plugin module must export a function')
    }
    const Plugin = createPlugin(require('./plugin-base'))
    if (!t.isClass(Plugin)) {
      throw new Error('Invalid plugin: plugin module must export a function which returns a class')
    }
    if (!Plugin.prototype.replace) {
      throw new Error('Invalid plugin: plugin class must implement a replace method')
    }
    return new Plugin()
  })
}

exports.regExpBuilder = regExpBuilder
exports.expandGlobPatterns = expandGlobPatterns
exports.depthFirstSort = depthFirstSort
exports.depthFirstCompare = depthFirstCompare
exports.loadPlugins = loadPlugins
