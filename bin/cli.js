#!/usr/bin/env node
"use strict";

var cliArgs = require("command-line-args"),
    dope = require("console-dope"),
    renamer = require("../lib/renamer"),
    s = require("string-tools");

var cli = cliArgs([
    {   name: "files", type: Array, defaultOption: true, value: [],
        description: "The files to rename. This is the default option." },
    {   name: "find", alias: "f",
        description: "The find string, or regular expression when --regex is set.\nIf not set, the whole filename will be replaced." },
    {   name: "replace", alias: "r", value: "",
        description: "The replace string. With --regex set, --replace can reference\nparenthesised substrings from --find with $1, $2, $3 etc.\nIf omitted, defaults to a blank string. The special token\n'{{index}}' will insert an incrementing number per file\nprocessed." },
    {   name: "regex", type: Boolean, alias: "e",
        description: "When set, --find is intepreted as a regular expression." },
    {   name: "dry-run", type: Boolean, alias: "d",
        description: "Used for test runs. Set this to do everything but rename the file." },
    {   name: "insensitive", type: Boolean, alias: "i",
        description: "Enable case-insensitive finds." },
    {   name: "verbose", type: Boolean, alias: "v",
        description: "Use to print additional information." },
    {   name: "help", type: Boolean, alias: "h",
        description: "Print usage instructions." }
]);

var usage = cli.getUsage({
    forms: [ "$ renamer <options> <files>" ],
    footer: "for more detailed instructions, visit https://github.com/75lb/renamer"
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
