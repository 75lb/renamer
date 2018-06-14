const EventEmitter = require('events').EventEmitter

class Renamer extends EventEmitter {
  /**
   * @param {object} options - The renamer options
   * @param {string[]} [options.files] - One or more glob patterns or names of files to rename.
   * @param {sting} [options.find]
   * @param {string} [options.replace]
   * @param {boolean} [options.insensitive]
   * @param {boolean} [options.dryRun]
   * @param {boolean} [options.regexp]
   * @param {boolean} [options.force]
   */
  rename (options) {
    const renameFile = require('./lib/rename-file')
    const Replacer = require('./lib/replacer')
    const util = require('./lib/util')

    /* create find regexp, incorporating --regexp and --insensitive */
    const findRe = util.regExpBuilder(options)
    const files = Renamer.expandGlobPatterns(options.files)
    const replacer = new Replacer(options.plugin)
    const replaceResults = files
      .map((file, index) => replacer.replace(file, findRe, options.replace, options.plugin, index, files))
      .sort((a, b) => Renamer.depthFirstCompare(a.from, b.from))
    for (const replaceResult of replaceResults) {
      this.emit('rename-start', replaceResult)
      if (replaceResult.renamed) {
        renameFile(replaceResult.from, replaceResult.to, { force: options.force, dryRun: options.dryRun })
        this.emit('rename-end', replaceResult)
      }
    }
  }

  static expandGlobPatterns (files) {
    const glob = require('glob')
    const flatten = require('reduce-flatten')
    const unique = require('reduce-unique')
    return files
      .map(file => glob.hasMagic(file) ? glob.sync(file, { nonull: true }) : file)
      .reduce(flatten, [])
      .reduce(unique, [])
  }

  static depthFirstSort (files) {
    return files.sort(this.depthFirstCompare)
  }

  static depthFirstCompare (a, b) {
    const path = require('path')
    const depth = {
      a: a.split(path.sep).length,
      b: b.split(path.sep).length
    }
    if (depth.a > depth.b) {
      return -1
    } if (depth.a === depth.b) {
      return 0
    } else {
      return 1
    }
  }
}

module.exports = Renamer
