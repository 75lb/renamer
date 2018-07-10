const EventEmitter = require('events').EventEmitter

/**
 * Rename files in bulk.
 * @module renamer
 */

/**
 * @alias module:renamer
 */
class Renamer extends EventEmitter {
  /**
   * @param {object} options - The renamer options
   * @param {string[]} [options.files] - One or more glob patterns or filenames to process.
   * @param {boolean} [options.dryRun] - Set this to do everything but rename the file. You should always set this flag until certain the output looks correct.
   * @param {boolean} [options.force] - If a target path exists, renamer will stop. With this flag set the target path will be overwritten. The main use-case for this flag is to enable changing the case of files on case-insensitive systems. Use with caution.
   * @param {string[]} [options.plugin] - One or more replacer plugins to use, pass an array of values to build a chain. For each value, supply either a) a path to a plugin file b) a path to a plugin package c) the name of a plugin package installed in the current working directory or above or d) the name of a built-in plugin, either 'default' or 'index'. The default plugin chain is `[ 'default', 'index' ]`, be sure to start with these plugins if you wish to extend default behaviour.
   * @param {sting|RegExp} [options.find] - Optional find string (e.g. `one`) or regular expression literal (e.g. `/one/i`). If omitted, the whole filename will be matched and replaced.
   * @param {string} [options.replace] - The replace string. If omitted, defaults to a empty string. The special token `{{index}}` will insert a number, incremented each time a file is replaced.
   * @emits module:renamer#rename-start
   */
  rename (options) {
    const renameFile = require('./lib/rename-file')
    const Replacer = require('./lib/replacer')
    const util = require('./lib/util')
    const arrayify = require('array-back')
    const files = util.expandGlobPatterns(arrayify(options.files))
    const replacer = new Replacer(options.plugin)
    const replaceResults = files
      .map((file, index) => replacer.replace(file, options, index, files))
      .sort((a, b) => util.depthFirstCompare(a.from, b.from))
    for (const replaceResult of replaceResults) {
      /**
       * Rename start
       * @event module:renamer#rename-start
       * @type {object}
       * @property {string} from - The filename before rename.
       * @property {string} to - The filename after rename.
       * @property {boolean} renamed - True if the file was renamed.
       */
      this.emit('rename-start', replaceResult)
      if (replaceResult.renamed) {
        renameFile(replaceResult.from, replaceResult.to, { force: options.force, dryRun: options.dryRun })
      }
    }
  }
}

module.exports = Renamer
