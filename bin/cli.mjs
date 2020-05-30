#!/usr/bin/env node --experimental-modules
import nodeVersionMatches from 'node-version-matches'
import CliApp from '../lib/cli-app.mjs'
import chalk from 'chalk'

/* v8.9.0 required for passing custom paths to require.resolve() */
if (nodeVersionMatches('>=8.9.0')) {
  const cliApp = new CliApp()
  cliApp.start()
} else {
  console.error(chalk.red('Renamer requires node v8.9.0 or above. Visit the website to upgrade: https://nodejs.org/'))
  process.exitCode = 1
}
