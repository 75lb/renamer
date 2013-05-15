#!/usr/local/bin/node

var fs = require("fs"),
	Thing = require("nature").Thing;

process.argv.splice(0, 2);

var optionSet = new Thing()
    .define({ 
        name: "files",
        type: Array,
        required: true,
        defaultOption: true,
        valueTest: [
            function(files){ return files.every(fs.existsSync); },
            function(files){ return files.length > 0; }
        ],
        valueFailMsg: "Must be at least one file, and all must exist"
    })
    .define({ name: "find", type: "string", alias: "f", required: true })
    .define({ name: "replace", type: "string", alias: "r", default: "" })
    .define({ name: "dry-run", type: "boolean", alias: "d" })
    .set(process.argv);

if (optionSet.valid){
    optionSet.files.forEach(function(file){
        var regEx = new RegExp(optionSet.find, "g"),
            newName = file.replace(regEx, optionSet.replace);
        console.log("new filename: " + newName);
        if (optionSet["dry-run"]){
            // do nothing else
        } else if (!fs.existsSync(newName)){
            fs.renameSync(file, newName);
        } else {
            console.error("a file by that new name already exists: " + newName);
            return;
        }
    });
    
} else {
    console.error(optionSet.errors);
}