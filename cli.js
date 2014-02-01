#!/usr/bin/env node
"use strict";

var fs = require("fs"),
    Thing = require("nature").Thing,
    history = require("./lib/history"),
    preset = require("./lib/preset"),
    rename = require("./lib/rename"),
    Glob = require("glob").Glob,
    wodge = require("wodge"), red = wodge.red, green = wodge.green, pluck = wodge.pluck,
    l = console.log;

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

var optionSet;
optionSet = new Thing()
    .on("error", function(err){
        l(red("Error: " + err.message));
        process.exit(1);
    })
    .mixIn(new rename.RenameOptions(), "rename")
    .define({ name: "dry-run", type: "boolean", alias: "d" })
    .define({ name: "help", type: "boolean", alias: "h" })
    .define({ name: "name", type: "string", alias: "n", valueTest: /\w+/ })
    .define({ name: "list", type: "boolean", alias: "l" })
    .set(process.argv);

function log(success, msg, error){
    l(
        "%s %s %s", 
        success ? green("✓") : red("✕"), 
        msg,
        error ? "(" + red(error) + ")" : ""
    );
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
        l(red(e.message));
        process.exit(1);
    }

    results.forEach(function(result){
        if (result.before === result.after || !result.after ){
            log(false, result.before);
        } else {
            if (fs.existsSync(result.after) || newFilenames.indexOf(result.after) > -1){
                log(false, result.before + wodge.green(" -> ") + result.after, "file exists");
            } else {
                if (!optionSet["dry-run"]) {
                    try {
                        fs.renameSync(result.before, result.after);
                        newFilenames.push(result.after);
                        log(true, result.before + wodge.green(" -> ") + result.after);
                    } catch(e){
                        log(false, result.before + wodge.green(" -> ") + result.after, e.message);
                    }
                } else {
                    newFilenames.push(result.after);
                    log(true, result.before + wodge.green(" -> ") + result.after);
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

l(optionSet.valid, optionSet.name)
if (optionSet.valid){
    if (optionSet.help){
        l(usage);
        process.exit(0);
    }

    if (optionSet.name) {
        var toSave = optionSet.where({ 
            name: {$ne: [ "files", "dry-run" ]}
        }).toJSON();
        l(toSave);
        preset.save(toSave);
    }

    if (optionSet.list){
        l("Preset list");
        l("===========");
        preset.list(function(list){
            l(list);
        });
        return; 
    }

    var noExist = pluck(fileList, function(val){ return val === false; }),
        files = pluck(fileList, function(val){ return val === 1; }),
        dirs = pluck(fileList, function(val){ return val === 2 || val instanceof Array; });

    noExist.forEach(function(file){
        l(red("File does not exist: " + file));
    });
    doWork(files);
    doWork(dirs.reverse());
} else {
    l(red("Some values were invalid"));
    l(red(optionSet.validationMessages.toString()));
    l(usage);
}

/*
TODO: replace token: $dirname, --js expression and $js token, date and string padding functions
renamer -i -f "something" -r "$1" --findModifier 'toUpperCase()' // returns SOMETHING
renamer -i -f "two words" -r "$1" --findModifier 'toTitleCase()' // returns Two Words
*/
