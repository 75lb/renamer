import chalk from 'chalk'

class DefaultView {
  start (stats) {
  }

  log (string) {
    console.log(string)
  }

  logResult (result) {
    const tick = process.platform === 'win32' ? '√' : '✔︎'
    const cross = process.platform === 'win32' ? '×' : '✖'
    const symbol = chalk`{${result.renamed ? 'green' : 'red'} ${result.renamed ? tick : cross}}`
    const desc = result.from + (result.to ? chalk.bold(' → ') + result.to : '')
    const errDesc = result.error ? chalk`({red ${result.error}})` : ''
    this.log(chalk`${symbol} ${desc} ${errDesc}`)
  }

  logError (err) {
    this.log(chalk.red(err.stack))
  }

  complete (stats) {
  }
}

export default DefaultView
