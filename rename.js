#!/usr/local/bin/node

var fs = require("fs"),
	Config = require("../config-master").Config;

var config = new Config()
    .define({ 
        name: "files",
        type: Array,
        required: true,
        defaultOption: true
    })
    .define({ name: "find", type: "string", alias: "f" })
    .define({ name: "replace", type: "string", alias: "r", default: "" })
    .define({ name: "dry-run", type: "boolean", alias: "d" });

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
