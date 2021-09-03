import chalk from 'chalk'

class DefaultView {
  log (string) {
    console.log(string || '')
  }

  logInfo (string) {
    this.log()
    this.log(chalk.bold.underline(string))
    this.log()
  }

  logResult (result, options = {}) {
    const tick = process.platform === 'win32' ? '√' : '✔︎'
    const cross = process.platform === 'win32' ? '×' : '✖'
    const symbol = chalk`{${result.renamed ? 'green' : 'red'} ${result.renamed ? tick : cross}}`
    const desc = result.from + (result.renamed ? chalk.bold(' → ') + result.to : '')
    const errDesc = result.error ? chalk`({red ${result.error}})` : ''
    if (result.renamed || options.verbose) {
      this.log(chalk`${symbol} ${desc} ${errDesc}`)
    }
  }

  logError (err) {
    this.log(chalk.red('ERROR: ' + err.message))
    this.log(chalk.red('\nRun `renamer --help` for usage instructions.\n'))
  }

  logComplete (stats) {
    this.log(`\nRename complete: ${stats.renamed} of ${stats.total} files renamed.\n`)
  }

  write (key, value, options) {
    const methodMap = {
      info: 'logInfo',
      usage: 'log',
      result: 'logResult',
      error: 'logError',
      complete: 'logComplete'
    }
    const method = this[methodMap[key]]
    if (method) {
      this[methodMap[key]](value, options)
    }
  }
}

export default DefaultView
