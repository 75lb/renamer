module.exports = PluginBase => class Default extends PluginBase {
  description () {
    return 'Find and replace strings and regular expressions.'
  }

  optionDefinitions () {
    return [
      {
        name: 'find',
        alias: 'f',
        type: String,
        description: 'Optional find string (e.g. `one`) or regular expression literal (e.g. `/one/i`). If omitted, the whole filename will be matched and replaced.'
      },
      {
        name: 'replace',
        alias: 'r',
        type: String,
        defaultValue: '',
        description: 'The replace string. If omitted, defaults to a empty string. The special token `\\{\\{index\\}\\}` will insert a number, incremented each time a file is replaced.'
      }
    ]
  }

  replace (filePath, options) {
    const path = require('path')
    let { find, replace } = options
    const file = this.parse(filePath)
    find = find || file.basename
    const newBasename = file.basename.replace(find, replace)
    if (newBasename) {
      return path.join(file.dirname, file.basename.replace(find, replace))
    } else {
      throw new Error(`Replace resulted in empty filename. File: ${filePath}, find: ${find}, replace: ${replace}`)
    }
  }
}
