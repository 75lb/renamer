#!/usr/bin/env node
'use strict'
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const cliOptions = require('../lib/cliOptions')
const renamer = require('../')
const ansi = require('ansi-escape-sequences')

const usageSections = [
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
    content: 'for more detailed instructions, visit {underline https://github.com/75lb/renamer}'
  }
]

let options
try {
  options = commandLineArgs(cliOptions)
} catch (err) {
  halt(err)
}

if (options.help) {
  console.log(commandLineUsage(usageSections))
} else if (options.files.length) {
  const fileStats = renamer.expand(options.files)
  options.files = fileStats.filesAndDirs

  fileStats.notExisting.forEach(function (file) {
    log(options.verbose, { before: file, error: 'does not exist' })
  })

  let results = renamer.replace(options)
  results = renamer.replaceIndexToken(results)
  if (results.list.length) {
    if (options['dry-run']) {
      console.log(ansi.format('Dry run', ['bold', 'underline']))
      renamer.dryRun(results).list.forEach(log.bind(null, options.verbose))
    } else {
      renamer.rename(results).list.forEach(log.bind(null, options.verbose))
    }
  }
} else {
  console.error(ansi.format('No input files supplied', 'red'))
  console.log(commandLineUsage(usageSections))
}

function log (verbose, result) {
  if (!verbose && !result.renamed) return
  const tick = process.platform === 'win32' ? '√' : '✔︎'
  const cross = process.platform === 'win32' ? '×': '✖'
  const symbol = `[${result.renamed ? 'green' : 'red'}]{${result.renamed ? tick : cross}}`
  const desc = result.before + (result.after ? ' -> ' + result.after : '')
  const errDesc = result.error ? `([red]{${result.error}})` : ''
  console.log(ansi.format(`${symbol} ${desc} ${errDesc}`))
}

function halt (err) {
  console.error(ansi.format(err.stack, 'red'))
  process.exit(1)
}
