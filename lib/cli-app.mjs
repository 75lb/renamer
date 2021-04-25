import { optionDefinitions, usageSections } from './cli-options.mjs'
import chalk from 'chalk'
import streamReadAll from 'stream-read-all'
import Renamer from '../index.mjs'
import { regExpBuilder, loadPlugins } from './util.mjs'
import fastDiff from 'fast-diff'
import commandLineUsage from 'command-line-usage'
import commandLineArgs from 'command-line-args'
import FindReplace from './plugin/find-replace.mjs'
import IndexReplace from './plugin/index-replace.mjs'
import flatten from 'reduce-flatten'

class CliApp {
  async start (startOptions = {}) {
    try {
      const { cliArgs, allOptionDefinitions } = await this.getPluginArgs(optionDefinitions, startOptions.argv)
      if (cliArgs.help) {
        this.printUsage(allOptionDefinitions, cliArgs.plugin)
      } else {
        if (!cliArgs.files.length) {
          const stdin = await streamReadAll(process.stdin)
          cliArgs.files = stdin.toString()
            .split(/\n|\r\n/)
            .filter(f => f)
            .filter(f => !(f === '.' || f === '..'))
        }
        const renamer = new Renamer()
        renamer.on('replace-result', replaceResult => {
          this.writeOutput(cliArgs.verbose, cliArgs.view, replaceResult)
        })
        try {
          if (cliArgs.dryRun) {
            this.log(chalk.bold.underline('Dry run'))
          }
          cliArgs.find = regExpBuilder(cliArgs.find)
          await renamer.rename(cliArgs)
        } catch (err) {
          this.halt(err)
          this.printUsage(allOptionDefinitions, cliArgs.plugin)
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

  logError (err) {
    this.log(chalk.red(err.stack))
  }

  writeOutput (verbose, view, result) {
    /* Only log not-renamed files if --verbose is set */
    if (!result.renamed && !verbose) return
    const tick = process.platform === 'win32' ? '√' : '✔︎'
    const cross = process.platform === 'win32' ? '×' : '✖'
    const symbol = chalk`{${result.renamed ? 'green' : 'red'} ${result.renamed ? tick : cross}}`

    const errDesc = result.error ? chalk`({red ${result.error}})` : ''
    if (view === 'long') {
      if (verbose) this.log('Renamed:'.padEnd(8), symbol)
      this.log('Before:'.padEnd(8), result.from)
      if (result.to) this.log('After:'.padEnd(8), result.to)
      this.log('--------')
    } else if (view === 'diff') {
      const data = []
      if (result.to) {
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
      if (verbose) this.log('Renamed:'.padEnd(8), symbol)
      this.log('Before:'.padEnd(8), result.from)
      if (result.to) this.log('After:'.padEnd(8), result.to)
      if (data.length) this.log('Diff:'.padEnd(8), data.join(''))
      this.log('--------')
    } else {
      const desc = result.from + (result.to ? chalk.bold(' → ') + result.to : '')
      this.log(chalk`${symbol} ${desc} ${errDesc}`)
    }
  }

  async printUsage (allOptionDefinitions = [], plugins = []) {
    const sections = await usageSections(allOptionDefinitions, plugins)
    this.log(commandLineUsage(sections))
  }

  halt (err) {
    this.logError(err)
    process.exitCode = 1
  }

  /**
   * Returns options and definitions for all replace chain plugins.
   * @param {object} [options]
   * @param {string[]} [options.paths]
   */
  async getPluginArgs (optionDefinitions, argv) {
    /* first parse to fetch the --chain values */
    let cliArgs = commandLineArgs(optionDefinitions, { partial: true, argv })
    const loadedPlugins = cliArgs.chain && cliArgs.chain.length
      ? await loadPlugins(cliArgs.chain)
      : [new FindReplace(), new IndexReplace()]

    const pluginOptionDefinitions = await this.getPluginOptionDefinitions(loadedPlugins)
    const allOptionDefinitions = optionDefinitions.concat(pluginOptionDefinitions)

    /* second parse now we have loaded the plugins and their option definitions */
    cliArgs = commandLineArgs(allOptionDefinitions, { argv, camelCase: true })
    cliArgs.plugin = loadedPlugins
    return {
      cliArgs,
      allOptionDefinitions
    }
  }

  /**
  ≈ Return an array of optionDefinitions
  */
  async getPluginOptionDefinitions (plugins) {
    const output = []
    for (const plugin of plugins) {
      if (plugin.optionDefinitions) {
        output.push(plugin.optionDefinitions())
      }
    }
    return output.reduce(flatten, [])
  }
}

export default CliApp
