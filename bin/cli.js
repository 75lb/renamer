#!/usr/bin/env node
const CliApp = require('../lib/cli-app')
const cliApp = new CliApp()
module.exports = cliApp.start()
