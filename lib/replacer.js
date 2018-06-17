'use strict'

class Replacer {
  constructor (pluginNames) {
    const path = require('path')
    const util = require('./util')
    this.plugins = []
    pluginNames = pluginNames || [ require('./plugin/default'), require('./plugin/index') ]
    for (const pluginName of pluginNames) {
      let createPlugin
      if (typeof pluginName === 'string') {
        createPlugin = util.loadModule(pluginName, { paths: [
          process.cwd(), path.resolve(__dirname, 'plugin')
        ]})
      } else {
        createPlugin = pluginName
      }
      const Plugin = createPlugin(require('./plugin-base'))
      this.plugins.push(new Plugin())
    }
  }

  /**
   * If `find` is falsy, the entire filename is replaced.
   * @returns {from: string, to: string, renamed: boolean} - Replacer result
   */
  replace (file, find, replace, index, files) {
    const path = require('path')
    find = find || path.basename(file)
    let to = ''
    let input = file
    for (const plugin of this.plugins) {
      to = plugin.replace(input, find, replace, index, files)
      input = to
    }
    const renamed = path.resolve(file) !== path.resolve(to)
    if (!renamed) to = null
    return { from: file, to, renamed }
  }
}

module.exports = Replacer
