const cliOptions = require('../lib/cli-options')
const chalk = require('chalk')

class CliApp {
  async start () {
    try {
      const commandLinePlugin = require('command-line-plugin')
      const path = require('path')
      const { options, allOptionDefinitions } = commandLinePlugin(cliOptions.optionDefinitions, {
        camelCase: true,
        create: function (createPlugin) {
          const Plugin = createPlugin(require('./plugin-base'))
          return new Plugin()
        },
        paths: [ path.resolve(__dirname, 'plugin'), '.' ]
      })

      if (options.help) {
        this.printUsage(allOptionDefinitions)
      } else {
        if (!options.files.length) {
          const streamReadAll = require('stream-read-all')
          const stdin = await streamReadAll(process.stdin)
          options.files = stdin.toString()
            .split(/\n|\r\n/)
            .filter(f => f)
            .filter(f => !(f === '.' || f === '..'))
        }
        const Renamer = require('../')
        const renamer = new Renamer()
        renamer.on('rename-start', replaceResult => {
          this.writeOutput(options.verbose, options.view, replaceResult)
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
      }
    } catch (err) {
      this.halt(err)
      this.printUsage()
    }
  }

  log (...args) {
    console.log(...args)
  }

  writeOutput (verbose, view, result) {
    /* Only log not-renamed files if --verbose is set */
    if (!result.renamed && !verbose) return
    const tick = process.platform === 'win32' ? '√' : '✔︎'
    const cross = process.platform === 'win32' ? '×' : '✖'
    const symbol = chalk`{${result.renamed ? 'green' : 'red'} ${result.renamed ? tick : cross}}`

    const errDesc = result.error ? chalk`({red ${result.error}})` : ''
    if (view === 'detail') {
      const fastDiff = require('fast-diff')
      const data = {
        renamed: symbol,
        before: result.from
      }
      if (result.to) {
        data.after = result.to
        const diff = fastDiff(result.from, result.to)
        data.diff = ''
        for (const [code, hunk] of diff) {
          if (code === 0) {
            data.diff += hunk
          } if (code === -1) {
            data.diff += chalk.bgRed(hunk)
          } if (code === 1) {
            data.diff += chalk.bgGreen.black(hunk)
          }
        }
      }
      this.log('Renamed:'.padEnd(8), data.renamed)
      this.log('Before:'.padEnd(8), data.before)
      this.log('After:'.padEnd(8), data.after)
      this.log('Diff:'.padEnd(8), data.diff)
      this.log('⎻⎻⎻⎻⎻⎻⎻')
    } else {
      const desc = result.from + (result.to ? chalk.bold(' → ') + result.to : '')
      this.log(chalk`${symbol} ${desc} ${errDesc}`)
    }
  }

  printUsage (allOptionDefinitions) {
    const commandLineUsage = require('command-line-usage')
    this.log(commandLineUsage(cliOptions.usageSections(allOptionDefinitions)))
  }

  halt (err) {
    this.log(chalk.red(err.stack))
    process.exitCode = 1
  }
}

module.exports = CliApp
