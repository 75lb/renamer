const nodeVersionMatches = require('node-version-matches')
if (!nodeVersionMatches('>=8.9.0')) {
  const chalk = require('chalk')
  console.error(chalk.red('Renamer requires node v8.9.0 or above. Visit the website to upgrade: https://nodejs.org/'))
  process.exit(1)
}

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
   * A synchronous method to rename files in bulk.
   * 
   * @param {object} options - The renamer options
   * @param {string[]} [options.files] - One or more glob patterns or filenames to process.
   * @param {boolean} [options.dryRun] - Set this to do everything but rename the file. You should always set this flag until certain the output looks correct.
   * @param {boolean} [options.force] - If a target path exists, renamer will stop. With this flag set the target path will be overwritten. The main use-case for this flag is to enable changing the case of files on case-insensitive systems. Use with caution.
   * @param {string[]} [options.plugin] - One or more replacer plugins to use, set the `--plugin` option multiple times to build a chain. For each value, supply either: a) a path to a plugin file b) a path to a plugin package c) the name of a plugin package installed globally or in the current working directory (or above) or d) the name of a built-in plugin, either `default` or `index`. The default plugin chain is `default` then `index`, be sure to set `-p default -p index` before your plugin if you wish to extend default behaviour.
   * @param {sting|RegExp} [options.find] - Optional find string (e.g. `one`) or regular expression literal (e.g. `/one/i`). If omitted, the whole filename will be matched and replaced.
   * @param {string} [options.replace] - The replace string. If omitted, defaults to a empty string.
   * @param {string} [options.pathElement] - The path element to rename, valid values are `base` (the default), `name` and `ext`. For example, in the path `pics/image.jpg`, the base is `image.jpg`, the name is `image` and the ext is `.jpg`.
   * @param {string} [options.indexFormat] - The format of the number to replace `{{index}}` with. Specify a standard printf format string, for example `%03d` would yield 001, 002, 003 etc. Defaults to `%d`.
   * @param {string} [options.indexRoot] - The initial value for `{{index}}`. Defaults to 1.
   * @emits module:renamer#replace-result
   */
  rename (options) {
    options = options || {}
    const renameFile = require('./lib/rename-file')
    const Replacer = require('./lib/replacer')
    const util = require('./lib/util')
    const arrayify = require('array-back')
    const files = util.expandGlobPatterns(arrayify(options.files))
    const replacer = new Replacer(options.plugin)
    const replaceResults = files
      .map((file, index) => replacer.replace(file, options, index, files))
    if (!options.dryRun) {
      replaceResults.sort((a, b) => util.depthFirstCompare(a.from, b.from))
    }
    for (const replaceResult of replaceResults) {
      /**
       * Emitted just before each file is processed.
       * @event module:renamer#replace-result
       * @type {object}
       * @property {string} from - The filename before rename.
       * @property {string} to - The filename after rename.
       * @property {boolean} renamed - True if the file was renamed.
       */
      this.emit('replace-result', replaceResult)
      if (replaceResult.renamed) {
        renameFile(replaceResult.from, replaceResult.to, { force: options.force, dryRun: options.dryRun })
      }
    }
  }
}

module.exports = Renamer
