module.exports = PluginBase => class RenamerIndex extends PluginBase {
  constructor () {
    super()
    this.matchCount = 1
  }

  optionDefinitions () {
    return [
      { name: 'index-format', description: 'The format of the number to replace `\\{\\{index\\}\\}` with. Specify a standard printf format string, e.g `%03d`. Defaults to `%d`.' }
    ]
  }

  replace (file, options) {
    if (/{{index}}/.test(file)) {
      const path = require('path')
      const basename = path.basename(file)
      const dirname = path.dirname(file)
      const newBasename = this.replaceIndexToken(basename, this.matchCount++, options.indexFormat || '%d')
      return path.join(dirname, newBasename)
    } else {
      return file
    }
  }

  replaceIndexToken (file, index, format) {
    const sprintf = require('printj').sprintf
    return file.replace(/{{index}}/g, sprintf(format, index))
  }
}
