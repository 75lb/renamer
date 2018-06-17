const EventEmitter = require('events').EventEmitter

/**
 * @module renamer
 */

/**
 * @alias module:renamer
 */
class Renamer extends EventEmitter {
  /**
   * @param {object} options - The renamer options
   * @param {string[]} [options.files] - One or more glob patterns or names of files to rename.
   * @param {sting|RegExp} [options.find] - Find expression.
   * @param {string} [options.replace]
   * @param {boolean} [options.dryRun]
   * @param {boolean} [options.force]
   * @param {string[]} [options.plugin]
   * @emits module:renamer#rename-start
   */
  rename (options) {
    const renameFile = require('./lib/rename-file')
    const Replacer = require('./lib/replacer')
    const util = require('./lib/util')

    const files = util.expandGlobPatterns(options.files)
    const replacer = new Replacer(options.plugin)
    const replaceResults = files
      .map((file, index) => replacer.replace(file, options.find, options.replace, options.plugin, index, files))
      .sort((a, b) => util.depthFirstCompare(a.from, b.from))
    for (const replaceResult of replaceResults) {
      /**
       * Rename start
       * @event module:renamer#rename-start
       * @type {object}
       * @property {string} from
       * @property {string} to
       */
      this.emit('rename-start', replaceResult)
      if (replaceResult.renamed) {
        renameFile(replaceResult.from, replaceResult.to, { force: options.force, dryRun: options.dryRun })
        this.emit('rename-end', replaceResult)
      }
    }
  }
}

module.exports = Renamer
