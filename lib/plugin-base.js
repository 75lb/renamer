'use strict'
const path = require('path')

class PluginBase {
  replaceBasename (file, find, replace) {
    const basename = path.basename(file)
    const dirname = path.dirname(file)
    return path.join(dirname, basename.replace(find || basename, replace))
  }
}

module.exports = PluginBase
