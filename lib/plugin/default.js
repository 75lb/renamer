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
        description: 'The replace string. If omitted, defaults to an empty string.'
      },
      {
        name: 'path-element',
        alias: 'e',
        description: 'The path element to rename, valid values are `base` (the default), `name` and `ext`. For example, in the path `pics/image.jpg`, the base is `image.jpg`, the name is `image` and the ext is `.jpg`.'
      }
    ]
  }

  replace (filePath, options) {
    const path = require('path')
    let { find, replace } = options || {}
    const file = path.parse(filePath)
    find = find || file.base
    const element = options.pathElement || 'base'
    if (element === 'base') {
      const basename = file.base.replace(find, replace)
      if (basename) {
        return path.join(file.dir, basename)
      } else {
        throw new Error(`Replace resulted in empty filename. File: ${filePath}, find: ${find}, replace: ${replace}`)
      }
    } else if ([ 'name', 'ext' ].includes(element)) {
      file[element] = file[element].replace(find, replace)
      const basename = file.name + file.ext
      if (basename) {
        return path.join(file.dir, basename)
      } else {
        throw new Error(`Replace resulted in empty filename. File: ${filePath}, find: ${find}, replace: ${replace}`)
      }
    } else {
      throw new Error('Invalid path element: ' + element)
    }
  }
}
