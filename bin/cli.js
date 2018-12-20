#!/usr/bin/env node
const nodeVersionMatches = require('node-version-matches')
if (nodeVersionMatches('>=8.9.0')) {
  const CliApp = require('../lib/cli-app')
  const cliApp = new CliApp()
  module.exports = cliApp.start()
} else {
  const chalk = require('chalk')
  console.error(chalk.red('Renamer requires node v8.9.0 or above. Visit the website to upgrade: https://nodejs.org/'))
  process.exitCode = 1
}
