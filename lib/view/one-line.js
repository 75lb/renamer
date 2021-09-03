import chalk from 'chalk'
import DefaultView from './default.js'

class OneLineView extends DefaultView {
  logComplete (stats, options) {
    const dryRun = options.dryRun ? chalk.bold.underline('Dry run.') + ' ' : ''
    this.log(`${dryRun}Rename complete: ${stats.renamed} of ${stats.total} files renamed.`)
  }

  write (key, value, options = {}) {
    const methodMap = {
      usage: 'log',
      error: 'logError',
      complete: 'logComplete'
    }
    const method = this[methodMap[key]]
    if (method) {
      this[methodMap[key]](value, options)
    }
  }
}

export default OneLineView
