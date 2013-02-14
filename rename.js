#!/usr/local/bin/node

var fs = require("fs"),
	Config = require("../config-master").Config;

var config = new Config()
    .option("files", { 
        type: Array.isArray,
        required: true,
        defaultOption: true
    })
    .option("find", { type: "string", alias: "f" })
    .option("replace", { type: "string", alias: "r", default: "" })
    .option("dry-run", { type: "boolean", alias: "d" });

process.argv.splice(0, 2);
config.set(process.argv);

if (config.hasValue("find")){
    config.get("files").forEach(function(file){
        if(fs.existsSync(file)){
            var regEx = new RegExp(config.get("find"), "g"),
                newName = file.replace(regEx, config.get("replace"));
            log("new filename: " + newName);
            if (!config.get("dry-run"))
                fs.renameSync(file, newName);
        } else {
            log("file doesn't exist: " + file);
        }
    });
}

function log(msg){
    console.log(msg);
}
