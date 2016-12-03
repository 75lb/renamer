'use strict'
var fileSet = require('file-set')
var s = require('string-tools')
var path = require('path')
var fs = require('fs')
var Result = require('./Result')
var Results = require('./Results')
var Usage = require('app-usage-stats')
var os = require('os')

var usage = new Usage('UA-70853320-5', {
  an: 'renamer',
  av: require('../package').version,
  sendInterval: 1000 * 60 * 60 * 24,
  metricMap: {
    invocation: 1,
    find: 2,
    replace: 3,
    regex: 4,
    'dry-run': 5,
    insensitive: 6,
    verbose: 7,
    help: 8
  }
})
usage.defaults
  .set('cd1', process.version)
  .set('cd2', os.type())
  .set('cd3', os.release())
usage.loadSync()
process.on('exit', function () { usage.saveSync() })

/**
@module renamer
*/
exports.Result = Result
exports.Results = Results
exports.replace = replace
exports.expand = expand
exports.rename = rename
exports.dryRun = dryRun
exports.replaceIndexToken = replaceIndexToken

/**
Perform the replace. If no `options.find` is supplied, the entire basename is replaced by `options.replace`.

@param {Object} options - Contains the file list and renaming options
@returns {Array} An array of ResultObject instances containing `before` and `after` info
*/
function replace (options) {
  var metrics = { invocation: 1 }
  for (var option in options) {
    metrics[option] = 1
  }
  usage.hit({ name: 'replace' }, metrics)
  var findRegex = regExBuilder(options)
  var results = new Results()
  results.list = options.files.map(replaceSingle.bind(null, findRegex, options.replace))
  return results
}

function replaceSingle (findRegex, replace, file) {
  var result = new Result({ before: path.normalize(file) })
  var dirname = path.dirname(file)
  var basename = path.basename(file)

  if (findRegex) {
    if (basename.search(findRegex) > -1) {
      basename = basename.replace(findRegex, replace)
      result.after = path.join(dirname, basename)
    } else {
      /* leave result.after blank, signifying no replace was performed */
    }
  } else {
    result.after = path.join(dirname, replace)
  }

  return result
}

function expand (files) {
  var fileStats = fileSet(files)
  fileStats.filesAndDirs = fileStats.files.concat(fileStats.dirs.reverse())
  return fileStats
}

/**
Takes a Results collection in, sets `renamed` and/or `error` on each with the expected values
@param {Results} results - the Results collection to operate on
@returns {Results} results
*/
function dryRun (results) {
  results.list = results.list.map(function (result, index, resultsSoFar) {
    var existing = resultsSoFar.filter(function (prevResult, prevIndex) {
      return prevIndex < index && (prevResult.before !== result.before) && (prevResult.after === result.after)
    })

    if (result.before === result.after || !result.after) {
      result.renamed = false
      result.error = 'no change'
    } else if (existing.length) {
      result.renamed = false
      result.error = 'file exists'
    } else {
      result.renamed = true
    }

    return result
  })
  return results
}

/**
Takes a Results collection in, performs the rename on disk setting `renamer` and `error` as appropriate
@param {Results} results - the Results collection to operate on
@returns {Results} results
*/
function rename (results) {
  results.list = results.list.map(function (result) {
    if (!result.after) {
      result.renamed = false
      result.error = 'no change'
      return result
    }
    try {
      if (fs.existsSync(result.after)) {
        result.renamed = false
        result.error = 'file exists'
      } else {
        fs.renameSync(result.before, result.after)
        result.renamed = true
      }
    } catch (e) {
      result.renamed = false
      result.error = e.message
    }
    return result
  })
  return results
}

function replaceIndexToken (results) {
  results.list = results.list.map(function (result, index) {
    if (result.after) {
      result.after = result.after.replace('{{index}}', index + 1)
    }
    return result
  })
  return results
}

/**
Search globally by default. If `options.regex` is not set then ensure any special regex characters in `options.find` are escaped. Do nothing if `options.find` is not set.
*/
function regExBuilder (options) {
  if (options.find) {
    var re = options.regex ? options.find : s.escapeRegExp(options.find)
    var reOptions = 'g' + (options.insensitive ? 'i' : '')
    return new RegExp(re, reOptions)
  }
}
