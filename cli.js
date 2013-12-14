#!/usr/bin/env node
"use strict";

var fs = require("fs"),
    Thing = require("nature").Thing,
    rename = require("./lib/rename"),
    Glob = require("glob").Glob,
    log = console.log;

var usage = "Usage: \n\
$ renamer [--regex] [--find <pattern>] [--replace <string>] [--dry-run] <files>\n\
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
-h, --help        Print usage instructions.\n";

function red(txt){ return "\x1b[31m" + txt + "\x1b[0m"; }
function green(txt){ return "\x1b[32m" + txt + "\x1b[0m"; }
function pluck(object, fn){
    var output = [];
    for (var prop in object){
        if (fn(object[prop])) output.push(prop);
    }
    return output;
}

var optionSet;
optionSet = new Thing()
    .on("error", function(err){
        log(red("Error: " + err.message));
        process.exit(1);
    })
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
    .set(process.argv);

if (optionSet.help){
    log(usage);
    process.exit(0);
}

function doWork(files){
    var results,
        newFilenames = [];

    try {
        results = rename.rename({
            files: files,
            find: optionSet.find,
            replace: optionSet.replace,
            regex: optionSet.regex,
            insensitive: optionSet.insensitive
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

var fileList = {};

if (optionSet.files){
    optionSet.files.forEach(function(file){

        if (fs.existsSync(file)){
            fileList[file] = fs.statSync(file).isDirectory() ? 2 : 1;
        } else {
            var glob = new Glob(file, { sync: true, stat: true });
            glob.found.forEach(function(file){
                fileList[file] = glob.cache[file];
            });
        }
    });
}

if (optionSet.valid){
    var noExist = pluck(fileList, function(val){ return val === false; }),
        files = pluck(fileList, function(val){ return val === 1; }),
        dirs = pluck(fileList, function(val){ return val === 2 || val instanceof Array; });

    noExist.forEach(function(file){
        log(red("File does not exist: " + file));
    });
    doWork(files);
    doWork(dirs.reverse());
} else {
    log(red("Some values were invalid"));
    log(red(optionSet.validationMessages.toString()));
    log(usage);
}

/*
TODO: presets, replace token: $dirname, --js expression and $js token, date and string padding functions, -i option for case-insensitive
renamer -i -f "something" -r "$1" --findModifier 'toUpperCase()' // returns SOMETHING
renamer -i -f "two words" -r "$1" --findModifier 'toProperCase()' // returns Two Words

*/
