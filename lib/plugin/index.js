module.exports = PluginBase => class RenamerIndex extends PluginBase {
  constructor () {
    super()
    this.matchCount = 1
  }

  optionDefinitions () {
    return [
      { name: 'index-format', description: 'The format of the number to replace `\\{\\{index\\}\\}` with. Specify a standard printf format string, for example `%03d` would yield 001, 002, 003 etc. Defaults to `%d`.' }
    ]
  }

  replace (filePath, options) {
    if (/{{index}}/.test(filePath)) {
      const path = require('path')
      const file = this.parse(filePath)
      const newBasename = this.replaceIndexToken(file.basename, this.matchCount++, options.indexFormat || '%d')
      return path.join(file.dirname, newBasename)
    } else {
      return filePath
    }
  }

  replaceIndexToken (basename, index, format) {
    const sprintf = require('printj').sprintf
    return basename.replace(/{{index}}/g, sprintf(format, index))
  }
}
