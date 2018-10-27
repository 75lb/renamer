module.exports = PluginBase => class Index extends PluginBase {
  description () {
    return 'Replace the `\\{\\{index\\}\\}` token in a path with a number incremented for each file renamed.'
  }

  optionDefinitions () {
    return [
      { name: 'index-format', description: 'The format of the number to replace `\\{\\{index\\}\\}` with. Specify a standard printf format string, for example `%03d` would yield 001, 002, 003 etc. Defaults to `%d`.' },
      { name: 'index-root', description: 'The initial value for `\\{\\{index\\}\\}`. Defaults to 1.' }
    ]
  }

  // Number to use in place of {{index}}.
  calculateMatchCount (indexRoot) {
    if (this.matchCount || this.matchCount === 0) {
      return this.matchCount
    } else if (indexRoot || indexRoot === 0) {
      return indexRoot
    } else {
      return 1
    }
  }

  replace (filePath, options) {
    if (/{{index}}/.test(filePath)) {
      this.matchCount = this.calculateMatchCount(options.indexRoot)
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
