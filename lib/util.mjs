import glob from 'glob'
import flatten from 'reduce-flatten'
import unique from 'reduce-unique'
import path from 'path'
import arrayify from 'array-back/index.mjs'
import * as t from 'typical/index.mjs'
import loadModule from 'load-module'
import globalModules from 'global-modules'
import PluginBase from './plugin-base.mjs'
import { fileURLToPath } from 'url'
import commandLineArgs from 'command-line-args'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
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
  return files
    .map(file => glob.hasMagic(file) ? glob.sync(file, { nonull: true }) : file)
    .reduce(flatten, [])
    .reduce(unique, [])
}

function depthFirstSort (files) {
  return files.sort(depthFirstCompare)
}

function depthFirstCompare (a, b) {
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
  return arrayify(pluginNames).map(pluginName => {
    let createPlugin
    if (typeof pluginName === 'string') {
      createPlugin = loadModule(pluginName, {
        paths: [path.resolve(__dirname, 'plugin'), '.', globalModules],
        prefix: 'renamer-'
      })
    } else {
      createPlugin = pluginName
    }
    if (!(typeof createPlugin === 'function' && !t.isClass(createPlugin))) {
      throw new Error('Invalid plugin: plugin module must export a function')
    }
    const Plugin = createPlugin(PluginBase)
    if (!t.isClass(Plugin)) {
      throw new Error('Invalid plugin: plugin module must export a function which returns a class')
    }
    if (!Plugin.prototype.replace) {
      throw new Error('Invalid plugin: plugin class must implement a replace method')
    }
    return new Plugin()
  })
}

/**
 * @param {object} [options]
 * @param {string[]} [options.paths]
 */
function commandLinePlugin (optionDefinitions, options) {
  options = options || {}
  const cliOptions = commandLineArgs(optionDefinitions, { partial: true, argv: options.argv })
  const allOptionDefinitions = optionDefinitions.concat(Array
    .from(pluginOptionDefinitions(options, cliOptions, optionDefinitions))
    .reduce(flatten, []))
  return {
    options: commandLineArgs(allOptionDefinitions, options),
    allOptionDefinitions
  }
}

function * pluginOptionDefinitions (options, cliOptions, optionDefinitions) {
  options = Object.assign({
    create: function (Plugin) {
      return new Plugin()
    }
  }, options)
  for (const def of optionDefinitions) {
    if (def.plugin) {
      const pluginRequests = arrayify(cliOptions[def.name])
      const Plugins = pluginRequests.map(p => loadModule(p, { paths: options.paths, prefix: options.prefix }))
      for (const Plugin of Plugins) {
        const plugin = options.create(Plugin)
        if (plugin.optionDefinitions) yield plugin.optionDefinitions()
      }
    }
  }
}

export { regExpBuilder, expandGlobPatterns, depthFirstSort, depthFirstCompare, loadPlugins, commandLinePlugin }
