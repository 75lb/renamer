import path from 'path'

class Suffix {
  /**
   * An optional description which will be printed in the "replace chain" section of `renamer --help`.
   * @returns {string}
   */
  description () {
    return 'Adds a suffix to the file name.'
  }

  /**
   * Zero or more custom option definitions.
   * @see https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md
   * @returns {OptionDefinition[]}
   */
  optionDefinitions () {
    return [
      {
        name: 'suffix',
        type: String,
        description: 'The suffix to append to each file.',
        defaultValue: ''
      }
    ]
  }

  /**
   * This method is mandatory and should modify the incoming file path as required, returning the new path.
   * @param {string} filePath - The current file path being processed
   * @param {object} options - The current renamer options (in camel-case), e.g. `options.find`, `options.replace` plus any custom options.
   * @param {number} index - The index of the current filePath within the full list of input files.
   * @param {string[]} files - The full list of input files being processed (after glob expressions have been expanded).
   * @returns {string} - The modified or unmodified file path.
   */
  replace (filePath, options) {
    const file = path.parse(filePath)
    const newName = file.name + options.suffix + file.ext
    return path.join(file.dir, newName)
  }
}

export default Suffix
