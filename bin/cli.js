#!/usr/bin/env node
"use strict";

var Model = require("nature").Model,
    dope = require("console-dope"),
    renamer = require("../lib/renamer"),
    RenamerOptions = renamer.RenamerOptions,
    w = require("wodge");

function log(verbose, result){
    if (!verbose && !result.renamed) return;
    dope.log(
        "%%%s{%s} %s %s",
        result.renamed ? "green" : "red",
        result.renamed ? w.symbol.tick : w.symbol.cross,
        result.before + (result.after ? " -> " + result.after : ""),
        result.error ? "(%red{" + result.error + "})" : ""
    );
}

function logError(msg){
    dope.red.error(msg);
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

var argv;
argv = new Model()
    .on("error", function(err){
        logError("Error: " + err.message);
        process.exit(1);
    })
    .mixIn(new RenamerOptions(), "rename")
    .define({ name: "verbose", type: "boolean", alias: "v" })
    .define({ name: "help", type: "boolean", alias: "h" })
    .set(process.argv);
    
if (!argv.valid) {
    logError("Some values were invalid");
    logError(argv.validationMessages.toString());
    dope.log(usage);
    process.exit(1);
}

if (argv.files.length){
    var options = argv.where({ group: "rename" });
    var fileStats = renamer.expand(options.files);
    options.files = fileStats.filesAndDirs;
    
    fileStats.notExisting.forEach(function(file){
        log(argv.verbose, { before: file, error: "does not exist" });
    });
    
    var results = renamer.replace(options);
    results = renamer.replaceIndexToken(results);
    if (results.list.length){
        if (options["dry-run"]){
            dope.bold.underline.log("Dry run");
            renamer.dryRun(results).list.forEach(log.bind(null, argv.verbose));
        } else {
            renamer.rename(results).list.forEach(log.bind(null, argv.verbose));
        }
    }
} else {
    dope.log(usage);
}
