const path = require('path')

module.exports = PluginBase => class RenamerIndex extends PluginBase {
  constructor () {
    super()
    this.matchCount = 1
  }

  replace (file, options) {
    if (/{{index}}/.test(file)) {
      const basename = path.basename(file)
      const dirname = path.dirname(file)
      return path.join(dirname, this.replaceIndexToken(basename, this.matchCount++))
    } else {
      return file
    }
  }

  replaceIndexToken (file, index) {
    return file.replace(/{{index}}/g, index)
  }
}
