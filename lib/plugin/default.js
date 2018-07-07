module.exports = PluginBase => class PluginDefault extends PluginBase {
  replace (file, options) {
    const path = require('path')
    const { find, replace } = options
    const basename = path.basename(file)
    const dirname = path.dirname(file)
    const newBasename = basename.replace(find, replace)
    if (newBasename) {
      return path.join(dirname, basename.replace(find, replace))
    } else {
      throw new Error(`Replace resulted in empty filename. File: ${file}, find: ${find}, replace: ${replace}`)
    }
  }
}
