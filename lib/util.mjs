import glob from 'glob'
import unique from 'reduce-unique'
import path from 'path'
import arrayify from 'array-back'
import * as t from 'typical/index.mjs'
import { loadModuleResolvedFrom, loadModulePathRelativeTo } from 'load-module'
import flatten from 'reduce-flatten'

/**
 * Convert a string like `/something/g` to a RegExp instance.
 */
export function regExpBuilder (find) {
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

export function expandGlobPatterns (files) {
  return files
    .map(file => glob.hasMagic(file) ? glob.sync(file, { nonull: true }) : file)
    .reduce(flatten, [])
    .reduce(unique, [])
}

export function depthFirstSort (files) {
  return files.sort(depthFirstCompare)
}

export function depthFirstCompare (a, b) {
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

/**
≈ Used once by either the cli or library depending on which is being used.
*/
export async function loadPlugins (pluginNames) {
  const plugins = []
  for (const pluginName of arrayify(pluginNames)) {
    let PluginClass
    if (typeof pluginName === 'string') {
      /* look for user-installed plugin */
      PluginClass = await loadModuleResolvedFrom(pluginName, process.cwd())
      if (PluginClass === null) {
        PluginClass = await loadModulePathRelativeTo(pluginName, [process.cwd(), '/Users/lloyd/Documents/75lb/renamer/lib/plugin'])
      }
      if (!t.isClass(PluginClass)) {
        throw new Error('Invalid plugin: plugin module must export a class')
      }
      plugins.push(new PluginClass())
    } else if (t.isClass(pluginName)) {
      plugins.push(new pluginName())
    } else {
      plugins.push(pluginName)
    }
  }
  if (!plugins.every(p => p.replace)) {
    throw new Error('Invalid plugin: plugin class must implement a replace method')
  }
  return plugins
}
