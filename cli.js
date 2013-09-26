#!/usr/local/bin/node
"use strict";

var fs = require("fs"),
    Thing = require("nature").Thing,
    path = require("path"),
    rename = require("./lib/rename"),
    Glob = require("glob").Glob,
    log = console.log;

function red(txt){ return "\x1b[31m" + txt + "\x1b[0m"; }
function green(txt){ return "\x1b[32m" + txt + "\x1b[0m"; }

log(process.argv)
var usage = "Usage: \n\
$ rename [--find <pattern>] [--replace <string>] [--dry-run] [--regex] <files>\n\
\n\
-f, --find      The find string, or regular expression when --regex is set.\n\
                If not set, the whole filename will be replaced.\n\
-r, --replace   The replace string. With --regex set, --replace can reference\n\
                parenthesised substrings from --find with $1, $2, $3 etc.\n\
                If omitted, defaults to a blank string. The special token\n\
                '{{index}}' will insert an incrementing number per file\n\
                processed.\n\
-e, --regex     When set, --find is intepreted as a regular expression.\n\
-d, --dry-run   Used for test runs. Set to do everything but rename the file.\n\
-h, --help      Print usage instructions.\n";

/*
TODO: Tidy error handling, presets
*/
var optionSet;
try {
    optionSet = new Thing()
        .mixIn(new rename.RenameOptions(), "rename")
        .define({ 
            name: "files",
            type: Array,
            required: true,
            defaultOption: true,
            groups: ["rename"],
            valueFailMsg: "Must supply at least one file, and all must exist"
        })
        .define({ name: "dry-run", type: "boolean", alias: "d" })
        .define({ name: "help", type: "boolean", alias: "h" })
        .on("error", function(err){
            console.error(red("Error: ") + err.message);
            process.exit(1);
        })
        .set(process.argv);
} catch (e){
    log(red("Invalid argument: " + e.message));
    process.exit(1);
}

if (optionSet.help){
    log(usage);
    process.exit(0);
}

var fileList = {};
optionSet.files.forEach(function(file){
    mixin(new Glob(file, { stat: true, sync: true, debug: false }).cache, fileList);
});

function mixin(from, to){
    for (var prop in from){
        to[prop] = from[prop];
    }
}

function pluck(object, fn){
    var output = [];
    for (var prop in object){
        if (fn(object[prop])) output.push(prop);
    }
    return output;
}

// log(fileList);

if (optionSet.valid){
    pluck(fileList, function(val){ return val === false; }).forEach(function(file){
        log(red("File does not exist: " + file));
    });
    doWork(pluck(fileList, function(val){ return val === 1; }));
    doWork(pluck(fileList, function(val){ return val === 2 || val instanceof Array; }));
} else {
    log(red("Error: some values were invalid"));
    log(red(optionSet.validationMessages.toString()));
    log(usage);
}


function doWork(files){
    var results,
        newFilenames = [];

    try {
        results = rename.rename({ 
            files: files, 
            find: optionSet.find, 
            replace: optionSet.replace,
            new: optionSet.new,
            regex: optionSet.regex
        });
    } catch (e){
        log(red(e.message));
        process.exit(1);
    }
    
    results.forEach(function(result){
        if (result.before === result.after || !result.after ){
            log("%s: %s", red("no change"), result.before);
        } else {
            if (fs.existsSync(result.after) || newFilenames.indexOf(result.after) > -1){
                log(
                    "%s: %s -> %s (%s)", 
                    red("no change"), 
                    result.before, 
                    result.after, 
                    red("file exists")
                );
            } else {
                if (!optionSet["dry-run"]) {
                    try {
                        fs.renameSync(result.before, result.after);
                        newFilenames.push(result.after);
                        log("%s: %s -> %s", green("rename: "), result.before, result.after);
                    } catch(e){
                        log(
                            "%s: %s -> %s (%s)", 
                            red("no change"), 
                            result.before, 
                            result.after, 
                            red(e.message)
                        );
                    }
                } else {
                    newFilenames.push(result.after);
                    log("%s: %s -> %s", green("rename: "), result.before, result.after);
                }
            }
        }
    });
}
