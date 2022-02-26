import { promises as fs, constants } from 'fs'
import path from 'path'
import arrayify from 'array-back'
import { isClass } from 'typical'
import { loadModuleResolvedFrom, loadModuleRelativeTo } from 'load-module'
import FindReplace from './chain/find-replace.js'
import IndexReplace from './chain/index-replace.js'
import getModulePaths from 'current-module-paths'
import * as globalDirs from 'global-dirs'
const __dirname = getModulePaths(import.meta.url).__dirname

class Plugins extends Array {
  async add (plugin) {
    if (typeof plugin.init === 'function') {
      await plugin.init()
    }
    this.push(plugin)
  }
  allValid () {
    return this.every(p => p.replace)
  }
}

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

/**
≈ Used once by either the cli or library depending on which is being used.
*/
export async function loadPlugins (pluginNames) {
  const plugins = new Plugins()
  for (const pluginName of arrayify(pluginNames)) {
    let PluginClass
    if (pluginName === 'find-replace') {
      plugins.add(new FindReplace())
    } else if (pluginName === 'index-replace') {
      plugins.add(new IndexReplace())
    } else if (typeof pluginName === 'string') {
      /* look for user-installed plugin both locally and globally */
      PluginClass = await loadModuleResolvedFrom(pluginName, [
        process.cwd(),
        globalDirs.npm.packages,
        globalDirs.yarn.packages
      ])
      if (PluginClass === null) {
        PluginClass = await loadModuleRelativeTo(pluginName, [process.cwd(), path.resolve(__dirname, './chain')])
      }
      if (PluginClass === null) {
        throw new Error('plugin could not be found: ' + pluginName)
      } else if (PluginClass && !isClass(PluginClass)) {
        throw new Error('Invalid plugin: plugin module must export a class')
      } else {
        plugins.add(new PluginClass())
      }
    } else if (isClass(pluginName)) {
      const Plugin = pluginName
      plugins.add(new Plugin())
    } else {
      plugins.add(pluginName)
    }
  }
  if (!plugins.allValid()) {
    throw new Error('Invalid plugin: all supplied replace-chain plugins must implement a `.replace()` method')
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
