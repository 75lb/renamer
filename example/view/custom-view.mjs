import chalk from 'chalk'

class CustomView {
  start () {
    console.log('\n🔥 START 🔥\n')
  }

  logResult (result) {
    if (result.renamed) {
      console.log(`${chalk.red(result.from.padEnd(25))} ${chalk.green(result.to)}`)
    }
  }

  logError (err) {
    console.error('ERROR', err.message)
  }

  complete (stats) {
    console.log(`\n🏆 COMPLETE (${stats.renamed} of ${stats.total}) 🏆\n`)
  }

  write (key, value, options) {
    const methodMap = {
      result: 'logResult',
      error: 'logError',
      start: 'start',
      complete: 'complete',
    }
    const method = methodMap[key]
    if (this[method]) {
      this[method](value, options)
    }
  }
}

export default CustomView
