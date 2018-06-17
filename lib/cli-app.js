const cliOptions = require('../lib/cli-options')
const chalk = require('chalk')

class CliApp {
  async start () {
    try {
      const commandLineArgs = require('command-line-args')
      const options = commandLineArgs(cliOptions.optionDefinitions, { camelCase: true })

      if (options.help) {
        this.printUsage()
      } else {
        if (!options.files.length) {
          const streamReadAll = require('stream-read-all')
          const stdin = await streamReadAll(process.stdin)
          options.files = stdin.toString()
            .split(/\n|\r\n/)
            .filter(f => f)
            .filter(f => !(f === '.' || f === '..'))
        }
      }
      const Renamer = require('../')
      const renamer = new Renamer()
      renamer.on('rename-start', replaceResult => {
        this.logReplace(options.verbose, replaceResult)
      })
      renamer.on('rename-end', replaceResult => {
        // this.logReplace(options.verbose, replaceResult)
      })
      try {
        if (options.dryRun) {
          this.log(chalk.bold.underline('Dry run'))
        }
        const util = require('./util')
        /* create find regexp, incorporating --regexp and --insensitive */
        options.find = util.regExpBuilder(options)
        renamer.rename(options)
      } catch (err) {
        this.halt(err)
      }
    } catch (err) {
      this.halt(err)
      this.printUsage()
    }
  }

  log (msg) {
    console.log(msg)
  }

  logReplace (verbose, result) {
    /* Only log not-renamed files if --verbose is set */
    if (!result.renamed && !verbose) return
    const tick = process.platform === 'win32' ? '√' : '✔︎'
    const cross = process.platform === 'win32' ? '×' : '✖'
    const symbol = chalk`{${result.renamed ? 'green' : 'red'} ${result.renamed ? tick : cross}}`
    // TODO: diff

    const desc = result.from + (result.to ? ' -> ' + result.to : '')
    const errDesc = result.error ? chalk`({red ${result.error}})` : ''
    this.log(chalk`${symbol} ${desc} ${errDesc}`)
  }

  printUsage () {
    const commandLineUsage = require('command-line-usage')
    this.log(commandLineUsage(cliOptions.usageSections))
  }

  halt (err) {
    this.log(chalk.red(err.message))
    process.exitCode = 1
  }
}

module.exports = CliApp
