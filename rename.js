#!/usr/local/bin/node

var fs = require("fs"),
    Thing = require("nature").Thing,
    path = require("path");

function red(txt){
    return "\033[31m" + txt + "\033[0m";
}

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
        console.error(red("Error: ") + err.message);
        process.exit(1);
    })
    .set(process.argv);

if (optionSet.valid){
    optionSet.files.forEach(function(file, index){
        var regEx = new RegExp(optionSet.find || path.basename(file), "g"),
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
    console.error(red("Some option values were invalid"));
    optionSet.validationMessages.forEach(function(prop){
        prop.validationMessages.forEach(function(msg){
            console.error(prop.property, ":\t", msg);
        });
    });
}