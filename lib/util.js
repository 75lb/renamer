/**
 * Search globally by default. If `options.regexp` is not set then ensure any special regex characters in `options.find` are escaped. Do nothing if `options.find` is not set.
 */
function regExpBuilder (options) {
  const regExpRe = /\/(.*)\/(\w*)/
  const find = options.find
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
  const loadModule = require('load-module')
  const arrayify = require('array-back')
  return arrayify(pluginNames).map(pluginName => {
    let createPlugin
    if (typeof pluginName === 'string') {
      createPlugin = loadModule(pluginName, {
        paths: [ path.resolve(__dirname, 'plugin'), '.' ],
        prefix: 'renamer-'
      })
    } else {
      createPlugin = pluginName
    }
    const Plugin = createPlugin(require('./plugin-base'))
    return new Plugin()
  })
}


exports.regExpBuilder = regExpBuilder
exports.expandGlobPatterns = expandGlobPatterns
exports.depthFirstSort = depthFirstSort
exports.depthFirstCompare = depthFirstCompare
exports.loadPlugins = loadPlugins
