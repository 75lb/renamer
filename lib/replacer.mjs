import { loadPlugins } from './util.mjs'
import arrayify from 'array-back/index.mjs'
import path from 'path'

class Replacer {
  constructor (pluginNames) {
    pluginNames = arrayify(pluginNames)
    this.plugins = loadPlugins(pluginNames.length ? pluginNames : ['default', 'index'])
  }

  /**
   * If `find` is falsy, the entire filename is replaced.
   * @returns {from: string, to: string, renamed: boolean} - Replacer result
   */
  replace (file, options, index, files) {
    let to = ''
    let input = file
    /* replace pipeline */
    for (const plugin of this.plugins) {
      to = plugin.replace(input, options, index, files)
      input = to
    }
    const renamed = path.resolve(file) !== path.resolve(to)
    if (!renamed) to = null
    return { from: file, to, renamed }
  }
}

export default Replacer
