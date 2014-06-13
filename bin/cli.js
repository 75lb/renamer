#!/usr/bin/env node
"use strict";

var cliArgs = require("command-line-args"),
    dope = require("console-dope"),
    renamer = require("../lib/renamer"),
    s = require("string-tools");

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

var usage = "Usage: \n\
$ renamer [--regex] [--find <pattern>] [--replace <string>] [--dry-run] [--verbose] <files>\n\
\n\
-f, --find        The find string, or regular expression when --regex is set.\n\
                  If not set, the whole filename will be replaced.\n\
-r, --replace     The replace string. With --regex set, --replace can reference\n\
                  parenthesised substrings from --find with $1, $2, $3 etc.\n\
                  If omitted, defaults to a blank string. The special token\n\
                  '{{index}}' will insert an incrementing number per file\n\
                  processed.\n\
-e, --regex       When set, --find is intepreted as a regular expression.\n\
-i, --insensitive Enable case-insensitive finds.\n\
-d, --dry-run     Used for test runs. Set this to do everything but rename the file.\n\
-v, --verbose     Use to print additional information.\n\
-h, --help        Print usage instructions.\n\
\n\
for more detailed instructions, visit https://github.com/75lb/renamer\n";

var argv = cliArgs([
    { name: "files", type: Array, defaultOption: true, value: [] },
    { name: "find", alias: "f" },
    { name: "replace", alias: "r", value: "" },
    { name: "regex", type: Boolean, alias: "e" },
    { name: "dry-run", type: Boolean, alias: "d" },
    { name: "insensitive", type: Boolean, alias: "i" },
    { name: "verbose", type: Boolean, alias: "v" },
    { name: "help", type: Boolean, alias: "h" }
]).parse();

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
