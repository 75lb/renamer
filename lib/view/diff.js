import chalk from 'chalk'
import DefaultView from './default.js'
import fastDiff from 'fast-diff'

class DiffView extends DefaultView {
  logResult (result, options = {}) {
    const tick = process.platform === 'win32' ? '√' : '✔︎'
    const cross = process.platform === 'win32' ? '×' : '✖'
    const symbol = chalk`{${result.renamed ? 'green' : 'red'} ${result.renamed ? tick : cross}}`

    const data = []
    if (result.renamed) {
      const diff = fastDiff(result.from, result.to)
      for (const [code, hunk] of diff) {
        if (code === 0) {
          data.push(hunk)
        } if (code === -1) {
          data.push(chalk.bgRed(hunk))
        } if (code === 1) {
          data.push(chalk.bgGreen.black(hunk))
        }
      }
    }

    if (options.verbose) {
      this.log(`${'Renamed:'.padEnd(8)} ${symbol}`)
      this.log(`${'Before:'.padEnd(8)} ${result.from}`)
      if (result.renamed) {
        this.log(`${'After:'.padEnd(8)} ${result.to}`)
      }
      if (data.length) {
        this.log(`${'Diff:'.padEnd(8)} ${data.join('')}`)
      }
      this.log('--------')
    } else {
      if (result.renamed) {
        this.log(`${'Before:'.padEnd(8)} ${result.from}`)
        this.log(`${'After:'.padEnd(8)} ${result.to}`)
        this.log(`${'Diff:'.padEnd(8)} ${data.join('')}`)
        this.log('--------')
      }
    }
  }
}

export default DiffView
