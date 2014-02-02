#!/usr/bin/env node
"use strict";

var fs = require("fs"),
    Thing = require("nature").Thing,
    presets = require("./lib/preset"),
    rename = require("./lib/rename"),
    Glob = require("glob").Glob,
    wodge = require("wodge"), red = wodge.red, green = wodge.green, pluck = wodge.pluck,
    l = console.log;

function log(success, msg, error){
    l(
        "%s %s %s",
        success ? green("✓") : red("✕"),
        msg,
        error ? "(" + red(error) + ")" : ""
    );
}
function logError(msg){
    l(red(msg));
}

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
        logError("Error: " + err.message);
        process.exit(1);
    })
    .mixIn(new rename.RenameOptions(), "rename")
    .define({ name: "dry-run", type: "boolean", alias: "d" })
    .define({ name: "help", type: "boolean", alias: "h" })
    .define("presets", [
        { name: "name", type: "string", alias: "n", valueTest: /\w+/ },
        { name: "list", type: "boolean", alias: "l" },
        { name: "preset", type: "string", alias: "p", valueTest: /\w+/ }
    ])
    .set(process.argv);

function doRename(from, to){
    var newFilenames = [],
        logMsg = from + wodge.green(" -> ") + to;

    if (from === to || !to ){
        log(false, from);
    } else {
        if (fs.existsSync(to) || newFilenames.indexOf(to) > -1){
            log(false, logMsg, "file exists");
        } else {
            if (!optionSet["dry-run"]) {
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

function doWork(files){
    var results;

    try {
        results = rename.rename({
            files: files,
            find: optionSet.find,
            replace: optionSet.replace,
            regex: optionSet.regex,
            insensitive: optionSet.insensitive
        });
    } catch (e){
        logError(e.message);
        process.exit(1);
    }

    results.forEach(function(result){
        doRename(result.before, result.after);
    });
}

var fileList = {};

if (optionSet.files){
    optionSet.files.forEach(function(file){
        if (fs.existsSync(file)){
            fileList[file] = fs.statSync(file).isDirectory() ? 2 : 1;
        } else {
            var glob = new Glob(file, { sync: true, stat: true });
            if (glob.found.length){
                glob.found.forEach(function(file){
                    fileList[file] = glob.cache[file];
                });
            } else {
                logError("File does not exist: " + file);
            }
        }
    });
}

function processFilelist(){
    var files = pluck(fileList, function(val){ return val === 1; }),
        dirs = pluck(fileList, function(val){ return val === 2 || val instanceof Array; });

    doWork(files);
    doWork(dirs.reverse());
}

if (optionSet.valid){
    if (optionSet.help){
        l(usage);

    } else if (optionSet.name) {
        var toSave = optionSet.where({
            name: {$ne: [ "files", "dry-run", "name" ]}
        }).toJSON();
        presets.save(optionSet.name, toSave);

    } else if (optionSet.list){
        l("Preset list");
        l("===========");
        presets.list(function(list){
            l(list);
        });

    } else if (optionSet.preset){
        presets.load(optionSet.preset, function(preset){
            optionSet.set(preset);
            processFilelist();
        });
    } else if (optionSet.files.length){
        processFilelist();
    } else {
        l(usage);
    }

} else {
    logError("Some values were invalid");
    logError(optionSet.validationMessages.toString());
    l(usage);
}

/*
TODO: replace token: $dirname, --js expression and $js token, date and string padding functions
renamer -i -f "something" -r "$1" --findModifier 'toUpperCase()' // returns SOMETHING
renamer -i -f "two words" -r "$1" --findModifier 'toTitleCase()' // returns Two Words
*/
