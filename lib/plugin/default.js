module.exports = PluginBase => class PluginDefault extends PluginBase {
  optionDefinitions () {
    return [
      {
        name: 'find',
        alias: 'f',
        type: String,
        description: 'Optional find string (e.g. "one") or regular expression literal (e.g. "/one/i"). If omitted, the whole filename will be matched and replaced.'
      },
      {
        name: 'replace',
        alias: 'r',
        type: String,
        defaultValue: '',
        description: "The replace string. If omitted, defaults to a empty string. The special token '\\{\\{index\\}\\}' will insert a number, incremented each time a file is replaced."
      }
    ]
  }

  replace (file, options) {
    const path = require('path')
    let { find, replace } = options
    const basename = path.basename(file)
    const dirname = path.dirname(file)
    find = find || basename
    const newBasename = basename.replace(find, replace)
    if (newBasename) {
      return path.join(dirname, basename.replace(find, replace))
    } else {
      throw new Error(`Replace resulted in empty filename. File: ${file}, find: ${find}, replace: ${replace}`)
    }
  }
}
