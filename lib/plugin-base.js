class PluginBase {
  /**
   * @param {string} filePath - The current file path being processed
   * @param {object} options - The current options (in camel-case), e.g. `options.find`, `options.replace` plus any custom options.
   * @param {number} index - The index of the current filePath within the full list of input files.
   * @param {string[]} files - The full list of input files to process (after glob expressions have been expanded).
   * @returns {string} - The modified or unmodified file path.
   */
  replace (filePath, options, index, files) {
    throw new Error('not implemented')
  }
}

module.exports = PluginBase
