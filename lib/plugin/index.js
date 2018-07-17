module.exports = PluginBase => class Index extends PluginBase {
  constructor () {
    super()
    this.matchCount = 1
  }

  description () {
    return 'Replace the `\\{\\{index\\}\\}` token in a path with a number incremented for each file renamed.'
  }

  optionDefinitions () {
    return [
      { name: 'index-format', description: 'The format of the number to replace `\\{\\{index\\}\\}` with. Specify a standard printf format string, for example `%03d` would yield 001, 002, 003 etc. Defaults to `%d`.' }
    ]
  }

  replace (filePath, options) {
    if (/{{index}}/.test(filePath)) {
      const path = require('path')
      const file = path.parse(filePath)
      const newBasename = this.replaceIndexToken(file.base, this.matchCount++, options.indexFormat || '%d')
      return path.join(file.dir, newBasename)
    } else {
      return filePath
    }
  }

  replaceIndexToken (basename, index, format) {
    const sprintf = require('printj').sprintf
    return basename.replace(/{{index}}/g, sprintf(format, index))
  }
}
