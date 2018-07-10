class PluginBase {
  replace () {
    throw new Error('not implemented')
  }
  
  parse (filePath) {
    const path = require('path')
    const dirname = path.dirname(filePath)
    const basename = path.basename(filePath)
    const extname = path.extname(filePath)
    const name = path.basename(filePath, extname)
    return { dirname, basename, extname, name }
  }
}

module.exports = PluginBase
