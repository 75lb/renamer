#!/usr/bin/env node
'use strict'
var tool = require('command-line-tool')
var cliOptions = require('../lib/cliOptions')
var dope = require('console-dope')
var renamer = require('../lib/renamer')
var s = require('string-tools')

var usageSections = [
  {
    header: 'renamer',
    content: 'Batch rename files and folders.'
  },
  {
    header: 'Synopsis',
    content: '$ renamer <options> <files>'
  },
  {
    header: 'Options',
    optionList: cliOptions,
    hide: 'files'
  },
  {
    content: 'for more detailed instructions, visit [underline]{https://github.com/75lb/renamer}'
  }
]

try {
  var cli = tool.getCli(cliOptions, usageSections)
} catch (err) {
  tool.halt(err)
}

var options = cli.options

if (options.files.length) {
  var fileStats = renamer.expand(options.files)
  options.files = fileStats.filesAndDirs

  fileStats.notExisting.forEach(function (file) {
    log(options.verbose, { before: file, error: 'does not exist' })
  })

  var results = renamer.replace(options)
  results = renamer.replaceIndexToken(results)
  if (results.list.length) {
    if (options['dry-run']) {
      dope.bold.underline.log('Dry run')
      renamer.dryRun(results).list.forEach(log.bind(null, options.verbose))
    } else {
      renamer.rename(results).list.forEach(log.bind(null, options.verbose))
    }
  }
} else {
  dope.red.error('No input files supplied')
  dope.log(cli.usage)
}

function log (verbose, result) {
  if (!verbose && !result.renamed) return
  dope.log(
    '%%%s{%s} %s %s',
    result.renamed ? 'green' : 'red',
    result.renamed ? s.symbol.tick : s.symbol.cross,
    result.before + (result.after ? ' -> ' + result.after : ''),
    result.error ? '(%red{' + result.error + '})' : ''
  )
}
