import chalk from 'chalk'
import DefaultView from './default.js'

class LongView extends DefaultView {
  logResult (result, options = {}) {
    const tick = process.platform === 'win32' ? '√' : '✔︎'
    const cross = process.platform === 'win32' ? '×' : '✖'
    const symbol = chalk`{${result.renamed ? 'green' : 'red'} ${result.renamed ? tick : cross}}`

    if (options.verbose) {
      this.log(`${'Renamed:'.padEnd(8)} ${symbol}`)
      this.log(`${'Before:'.padEnd(8)} ${result.from}`)
      if (result.renamed) {
        this.log(`${'After:'.padEnd(8)} ${result.to}`)
      }
      this.log('--------')
    } else {
      if (result.renamed) {
        this.log(`${'Before:'.padEnd(8)} ${result.from}`)
        this.log(`${'After:'.padEnd(8)} ${result.to}`)
        this.log('--------')
      }
    }
  }
}

export default LongView
