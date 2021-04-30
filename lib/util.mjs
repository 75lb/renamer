import * as fs from 'fs/promises'
import { constants } from 'fs'
import glob from 'glob'
import unique from 'reduce-unique'
import path from 'path'
import arrayify from 'array-back'
import * as t from 'typical/index.mjs'
import { loadModuleResolvedFrom, loadModuleRelativeTo } from 'load-module'
import flatten from 'reduce-flatten'
import getModulePaths from 'current-module-paths'
const __dirname = getModulePaths(import.meta.url).__dirname

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
        PluginClass = await loadModuleRelativeTo(pluginName, [process.cwd(), path.resolve(__dirname, './chain')])
      }
      if (PluginClass === null) {
        throw new Error('plugin could not be found: ' + pluginName)
      } else if (PluginClass && !t.isClass(PluginClass)) {
        throw new Error('Invalid plugin: plugin module must export a class')
      } else {
        plugins.push(new PluginClass())
      }
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

export async function isFileAccessible (file) {
  try {
    await fs.access(file, constants.R_OK | constants.W_OK)
    return true
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    } else {
      throw err
    }
  }
}
