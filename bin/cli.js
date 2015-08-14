#!/usr/bin/env node
"use strict";
var cliArgs = require("command-line-args");
var cliOptions = require("../lib/cliOptions");
var dope = require("console-dope");
var renamer = require("../lib/renamer");
var s = require("string-tools");

var cli = cliArgs(cliOptions);
var usage = cli.getUsage({
    title: "renamer",
    description: "Batch rename files and folders.",
    forms: "$ renamer <options> <files>",
    footer: "for more detailed instructions, visit [underline]{https://github.com/75lb/renamer}",
    hide: "files"
});

try{
    var argv = cli.parse();
} catch(err){
    halt(err);
}

if (argv.files.length){
    var fileStats = renamer.expand(argv.files);
    argv.files = fileStats.filesAndDirs;

    fileStats.notExisting.forEach(function(file){
        log(argv.verbose, { before: file, error: "does not exist" });
    });

    var results = renamer.replace(argv);
    results = renamer.replaceIndexToken(results);
    if (results.list.length){
        if (argv["dry-run"]){
            dope.bold.underline.log("Dry run");
            renamer.dryRun(results).list.forEach(log.bind(null, argv.verbose));
        } else {
            renamer.rename(results).list.forEach(log.bind(null, argv.verbose));
        }
    }
} else {
    dope.log(usage);
}

function log(verbose, result){
    if (!verbose && !result.renamed) return;
    dope.log(
        "%%%s{%s} %s %s",
        result.renamed ? "green" : "red",
        result.renamed ? s.symbol.tick : s.symbol.cross,
        result.before + (result.after ? " -> " + result.after : ""),
        result.error ? "(%red{" + result.error + "})" : ""
    );
}

function halt(err){
    dope.red.error(err.message);
    dope.log(usage);
    process.exit(1);
}
