'use strict'
const fs = require('fs')
const dryRunLog = {}

function renameFile (from, to, options) {
  options = options || {}
  /* Prevent user over-writing an existing file, unless --force */
  if (fs.existsSync(to) && !options.force) {
    const err = new Error(`Unable to rename ${from} to ${to} [file exists]`)
    err.code = 'exists'
    throw err
  } else {
    if (options.dryRun) {
      if (dryRunLog[to] && !options.force) {
        throw new Error(`Unable to rename "${from}" to "${to}" [file exists]`)
      } else {
        dryRunLog[to] = from
      }
    } else {
      fs.renameSync(from, to)
    }
  }
}

module.exports = renameFile
