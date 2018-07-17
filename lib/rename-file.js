const fs = require('fs')
const dryRunLog = {}

/**
 * @param {string} - The current file path.
 * @param {string} - To file path to renamer to.
 * @param {object} [options] - Options object.
 * @param {boolean} [options.force] - Force the rename, even if `fs.exists` reports the `to` path exists.
 * @param {boolean} [options.dryRun] - Simulate the rename.
 */
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
