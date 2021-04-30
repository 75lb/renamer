import { optionDefinitions, usageSections } from './cli-options.mjs'
import chalk from 'chalk'
import streamReadAll from 'stream-read-all'
import Renamer from '../index.mjs'
import { regExpBuilder, loadPlugins } from './util.mjs'
import commandLineUsage from 'command-line-usage'
import commandLineArgs from 'command-line-args'
import FindReplace from './chain/find-replace.mjs'
import IndexReplace from './chain/index-replace.mjs'
import flatten from 'reduce-flatten'
import DefaultView from './view/default.mjs'
import LongView from './view/long.mjs'
import DiffView from './view/diff.mjs'
import OneLineView from './view/one-line.mjs'
import * as t from 'typical/index.mjs'
import { loadModule } from 'load-module'

class CliApp {
  /** new cliApp(options)
  • [options.view] :View     - Used by test suite
  */
  constructor (options = {}) {
    this.view = options.view || new DefaultView()
  }

  /** cliApp.start(options)
  ≈ Process the renames.
  • [startOptions.argv] :string[] - Used by test suite
  */
  async start (startOptions = {}) {
    try {
      const { cliArgs, allOptionDefinitions } = await this.getPluginArgs(optionDefinitions, startOptions.argv)

      /* set view */
      const view = cliArgs.view || this.view
      if (view) {
        if (view === 'long') {
          this.view = new LongView()
        } else if (view === 'diff') {
          this.view = new DiffView()
        } else if (view === 'one-line') {
          this.view = new OneLineView()
        } else {
          if (t.isString(view)) {
            // TODO: load plugin
            const ViewClass = await loadModule(view, { paths: process.cwd() })
            this.view = new ViewClass()
          } else {
            this.view = view
          }
        }
        if (!(this.view.write && typeof this.view.write === 'function')) {
          throw new Error('View must define a `write` method')
        }
      }

      this.options = cliArgs

      if (cliArgs.silent) {
        function noOp () {}
        this.view = new Proxy(this.view, {
          get: (view, prop) => {
            if (['write'].includes(prop)) {
              // silence log invocations
              return noOp
            } else {
              return Reflect.get(view, prop)
            }
          }
        })
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
        const stats = {}
        try {
          /* parse regular expression */
          cliArgs.find = regExpBuilder(cliArgs.find)

          if (cliArgs.dryRun) {
            this.view.write('info', 'Dry run', this.options)
          }

          /* rename files */
          this.view.write('start', null, this.options)
          const results = []
          for await (const replaceResult of renamer.resultIterator(cliArgs)) {
            this.view.write('result', replaceResult, this.options)
            results.push(replaceResult)
          }
          stats.total = results.length
          stats.renamed = results.filter(r => r.renamed).length
          stats.notRenamed = stats.total - stats.renamed
          this.view.write('complete', stats, this.options)
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

  async printUsage (allOptionDefinitions = [], plugins = []) {
    const sections = await usageSections(allOptionDefinitions, plugins)
    if (this.view.write && typeof this.view.write === 'function') {
      this.view.write('usage', commandLineUsage(sections), this.options)
    } else {
      console.error(commandLineUsage(sections))
    }

  }

  halt (err) {
    if (this.view.write && typeof this.view.write === 'function') {
      this.view.write('error', err, this.options)
    } else {
      console.error(chalk.red(err.stack))
    }
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
