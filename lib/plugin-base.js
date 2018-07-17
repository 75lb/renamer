class PluginBase {
  /**
   * @param {string} filePath - The current file path being processed
   * @param {object} options - The current options, e.g. `options.find`, `options.replace` plus any custom options.
   * @param {number} index - The index of the current filePath in the full list of files to process.
   * @param {string[]} files - The full list of files to process (after any glob expressions have been expanded).
   */
  replace (filePath, options, index, files) {
    throw new Error('not implemented')
  }
}

module.exports = PluginBase
