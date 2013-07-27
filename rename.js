#!/usr/local/bin/node

var fs = require("fs"),
	Thing = require("nature").Thing;

/**
TODO: rename beyutch/file* -r "clive{{index}}.txt"
*/
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
    .define({ name: "find", type: "string", alias: "f" })
    .define({ name: "replace", type: "string", alias: "r", default: "" })
    .define({ name: "dry-run", type: "boolean", alias: "d" })
    .on("error", function(err){
        console.error("\033[31mError:\033[0m " + err.message);
        process.exit(1);
    })
    .set(process.argv);

if (optionSet.valid){
    optionSet.files.forEach(function(file, index){
        var regEx = new RegExp(optionSet.find || file, "g"),
            newName = file.replace(regEx, optionSet.replace)
                          .replace("{{index}}", index + 1);
        if(newName === file || newName === ""){
            console.log("no change: " + file);
        } else {
            console.log(file, "->", newName);
            if (optionSet["dry-run"]){
                // do nothing else
            } else if (!fs.existsSync(newName)){
                fs.renameSync(file, newName);
            } else {
                console.error("a file by that new name already exists: " + newName);
                return;
            }
        }
    });
    
} else {
    console.error(optionSet.validationMessages);
}