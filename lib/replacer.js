class Replacer {
  constructor (pluginNames) {
    const util = require('./util')
    const arrayify = require('array-back')
    pluginNames = arrayify(pluginNames)
    this.plugins = util.loadPlugins(pluginNames.length ? pluginNames : [ 'default', 'index' ])
  }

  /**
   * If `find` is falsy, the entire filename is replaced.
   * @returns {from: string, to: string, renamed: boolean} - Replacer result
   */
  replace (file, options, index, files) {
    const path = require('path')
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

module.exports = Replacer
