#!/usr/bin/env node
"use strict";

var Model = require("nature").Model,
    dope = require("console-dope"),
    renamer = require("./lib/renamer"),
    Renamer = renamer.Renamer,
    RenameOptions = renamer.RenameOptions,
    w = require("wodge");

function log(success, msg, error){
    dope.log(
        "%%%s{%s} %s %s",
        success ? "green" : "red",
        success ? w.symbol.tick : w.symbol.cross,
        msg,
        error ? "(%red{" + error + "})" : ""
    );
}
function logError(msg){
    dope.red.log(msg);
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
    .mixIn(new RenameOptions(), "rename")
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
    if (argv["dry-run"]) dope.bold.underline.log("Dry run");
    
    var renamer = new Renamer(argv.where({ group: "rename" }));
    var results = renamer.process();
    results.forEach(function(file){
        if (file.error){
            logError(file.error);
        } else {
            if(file.renamed){
                log(true, file.before + " %green{->} " + file.after);
            } else if (!file.renamed && argv.verbose){
                log(false, file.before);
            }
        }
    });
} else {
    dope.log(usage);
}

/*
TODO: replace token: $dirname, --js expression and $js token, date and string padding functions
renamer -i -f "something" -r "$1" --findModifier 'toUpperCase()' // returns SOMETHING
renamer -i -f "two words" -r "$1" --findModifier 'toTitleCase()' // returns Two Words
integration tests
accept input from stdin
chain rename presets together.. remove "this" then "that".. 
*/
/* 
BUG: renamer -r blah{{index}} * // index should not reset when processing folders, also appears incorrectly as tick in dry-run
 */
