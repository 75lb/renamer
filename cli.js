#!/usr/bin/env node
"use strict";

var fs = require("fs"),
    Thing = require("nature").Thing,
    dope = require("console-dope"),
    rename = require("./lib/rename"),
    Glob = require("glob").Glob,
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
-R, --recursive   Process folders recursively.\n\
-e, --regex       When set, --find is intepreted as a regular expression.\n\
-i, --insensitive Enable case-insensitive finds.\n\
-d, --dry-run     Used for test runs. Set this to do everything but rename the file.\n\
-v, --verbose     Use to print additional information.\n\
-h, --help        Print usage instructions.\n\
\n\
for more detailed instructions, visit https://github.com/75lb/renamer\n";

var argv;
argv = new Thing()
    .on("error", function(err){
        logError("Error: " + err.message);
        process.exit(1);
    })
    .mixIn(new rename.RenameOptions(), "rename")
    .define({ name: "dry-run", type: "boolean", alias: "d" })
    .define({ name: "help", type: "boolean", alias: "h" })
    .define({ name: "verbose", type: "boolean", alias: "v" })
    .define({ name: "recursive", type: "boolean", alias: "R" })
    .define("presets", [
        { name: "name", type: "string", alias: "n", valueTest: /\w+/ },
        { name: "list", type: "boolean", alias: "l" },
        { name: "preset", type: "string", alias: "p", valueTest: /\w+/ },
        { name: "description", type: "string", alias: "x", valueTest: /\w+/ }
    ])
    .define({ name: "user", type: "string" })
    .set(process.argv);
    
if (!argv.valid) {
    logError("Some values were invalid");
    logError(argv.validationMessages.toString());
    dope.log(usage);
    process.exit(1);
}

function doRename(from, to){
    var newFilenames = [],
        logMsg = from + " %green{->} " + to;

    if (from === to || !to ){
        if (argv.verbose) log(false, from);
    } else {
        if (fs.existsSync(to) || newFilenames.indexOf(to) > -1){
            log(false, logMsg, "file exists");
        } else {
            if (!argv["dry-run"]) {
                try {
                    fs.renameSync(from, to);
                    newFilenames.push(to);
                    log(true, logMsg);
                } catch(e){
                    log(false, logMsg, e.message);
                }
            } else {
                newFilenames.push(to);
                log(true, logMsg);
            }
        }
    }
}

function renameFiles(files){
    var results;

    try {
        results = rename.rename({
            files: files,
            find: argv.find,
            replace: argv.replace,
            regex: argv.regex,
            insensitive: argv.insensitive
        });
    } catch (e){
        logError(e.message);
        process.exit(1);
    }

    results.forEach(function(result){
        doRename(result.before, result.after);
    });
}

function getFileStats(files){
    var fileStats = {},
        existingFiles = files.filter(fs.existsSync),
        notExistingFiles = w.without(files, existingFiles);
        
    existingFiles.forEach(function(file){
        fileStats[file] = fs.statSync(file).isDirectory() ? 2 : 1;
    });
    
    notExistingFiles.forEach(function(file){
        var glob = new Glob(file, { sync: true, stat: true });
        if (glob.found.length){
            glob.found.forEach(function(file){
                fileStats[file] = glob.cache[file];
            });
        } else {
            logError("File does not exist: " + file);
        }
    });
    return fileStats;
}

function processFiles(list, recursive) {
    var fileStats = getFileStats(list),
        files = w.pluck(fileStats, function(val){ return val === 1; }),
        dirs = w.pluck(fileStats, function(val){ return val === 2 || val instanceof Array; });

    renameFiles(files);
    if (recursive) {
        dirs.forEach(function(dir) {
            var list = fs.readdirSync(dir).map(function(filename) {
                return dir + "/" + filename;
            });
            processFiles(list, true);
        });
    } else {
        renameFiles(dirs.reverse());
    }
}

if (argv.files.length) {
    processFiles(argv.files, argv.recursive);
} else {
    dope.log(usage);
}

/*
TODO: replace token: $dirname, --js expression and $js token, date and string padding functions
renamer -i -f "something" -r "$1" --findModifier 'toUpperCase()' // returns SOMETHING
renamer -i -f "two words" -r "$1" --findModifier 'toTitleCase()' // returns Two Words
integration tests
accept input from stdin
*/
/* 
BUG: renamer -r blah{{index}} * // index should not reset when processing folders, also appears incorrectly as tick in dry-run
 */
