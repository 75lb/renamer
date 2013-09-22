#!/usr/local/bin/node
"use strict";

var fs = require("fs"),
    Thing = require("nature").Thing,
    path = require("path"),
    rename = require("./lib/rename");

function red(txt){
    return "\x1b[31m" + txt + "\x1b[0m";
}
function green(txt){
    return "\x1b[32m" + txt + "\x1b[0m";
}

/*
TODO: Tidy error handling
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
            valueTest: [
                function(files){ return files.every(fs.existsSync); },
                function(files){ return files.length > 0; }
            ],
            valueFailMsg: "Must be at least one file, and all must exist"
        })
        .define({ name: "dry-run", type: "boolean", alias: "d" })
        .on("error", function(err){
            console.error(red("Error: ") + err.message);
            process.exit(1);
        })
        .set(process.argv);
} catch (e){
    console.error(red("Invalid argument: " + e.message));
    process.exit(1);
}

if (optionSet.valid){
    var results,
        newFilenames = [];
    try {
        results = rename.rename(optionSet.where({ group: "rename" }));
    } catch (e){
        console.error(red(e.message));
        process.exit(1);
    }
    results.forEach(function(result){
        if (result.before === result.after || !result.after ){
            console.log(red("no change: ") + result.before);
        } else {
            if (fs.existsSync(result.after) || newFilenames.indexOf(result.after) > -1){
                console.log(red("no change: "), result.before, "->", result.after, red("(file exists)"));
            } else {
                if (!optionSet["dry-run"]) fs.renameSync(result.before, result.after);
                newFilenames.push(result.after);
                console.log(green("rename: ") + result.before, "->", result.after);
            }
        }
    });
    
} else {
    console.error(red("Error: some option values were invalid"));
    console.error(optionSet.validationMessages.toString());
}
