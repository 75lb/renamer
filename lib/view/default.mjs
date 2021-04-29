import chalk from 'chalk'

class DefaultView {
  log (string) {
    console.log(string)
  }

  logInfo (string) {
    this.log(chalk.bold.underline(string))
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
    this.log(chalk.red(err.stack))
  }

  write (key, value, options) {
    const methodMap = {
      info: 'logInfo',
      usage: 'log',
      result: 'logResult',
      error: 'logError'
    }
    const method = this[methodMap[key]]
    if (method) {
      this[methodMap[key]](value, options)
    }
  }
}

export default DefaultView
