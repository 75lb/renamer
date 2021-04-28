import { optionDefinitions, usageSections } from './cli-options.mjs'
import chalk from 'chalk'
import streamReadAll from 'stream-read-all'
import Renamer from '../index.mjs'
import { regExpBuilder, loadPlugins } from './util.mjs'
import commandLineUsage from 'command-line-usage'
import commandLineArgs from 'command-line-args'
import FindReplace from './plugin/find-replace.mjs'
import IndexReplace from './plugin/index-replace.mjs'
import flatten from 'reduce-flatten'
import DefaultView from './view/default.mjs'
import LongView from './view/long.mjs'
import DiffView from './view/diff.mjs'
import * as t from 'typical/index.mjs'

class CliApp {
  constructor (options = {}) {
    this.view = options.view || new DefaultView()
  }

  /** cliApp.start(options)
  ≈ Process the renames.
  • [startOptions.argv] :string[] - Used by test suite
  • [startOptions.view] :View     - Used by test suite
  */
  async start (startOptions = {}) {
    try {
      const { cliArgs, allOptionDefinitions } = await this.getPluginArgs(optionDefinitions, startOptions.argv)

      /* set view */
      const view = startOptions.view || cliArgs.view
      if (view) {
        if (view === 'long') {
          this.view = new LongView()
        } else if (view === 'diff') {
          this.view = new DiffView()
        } else {
          if (t.isString(view)) {
            // load plugin
          } else {
            this.view = view
          }
        }
      }

      if (cliArgs.help) {
        this.printUsage(allOptionDefinitions, cliArgs.plugin)
      } else {
        if (!cliArgs.files.length) {
          /* read file list from stdin */
          const stdin = await streamReadAll(process.stdin)
          cliArgs.files = stdin.toString()
            .split(/\n|\r\n/)
            .filter(f => f)
            .filter(f => !(f === '.' || f === '..'))
        }
        const renamer = new Renamer()
        try {
          /* parse regular expression */
          cliArgs.find = regExpBuilder(cliArgs.find)

          if (this.view.start) {
            this.view.start()
          }
          if (cliArgs.dryRun) {
            this.view.log(chalk.bold.underline('Dry run'))
          }

          for await (const replaceResult of renamer.resultIterator(cliArgs)) {
            this.view.logResult(replaceResult, { verbose: cliArgs.verbose })
          }
        } catch (err) {
          this.halt(err)
          this.printUsage(allOptionDefinitions, cliArgs.plugin)
        } finally {
          if (this.view.complete) {
            this.view.complete()
          }
        }
      }
    } catch (err) {
      this.halt(err)
      this.printUsage()
    }
  }

  async printUsage (allOptionDefinitions = [], plugins = []) {
    const sections = await usageSections(allOptionDefinitions, plugins)
    this.view.log(commandLineUsage(sections))
  }

  halt (err) {
    this.view.logError(err)
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
