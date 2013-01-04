#!/usr/local/bin/node

var fs = require("fs"),
    util = require("util"),
	config = require("config-master");

var valid = true;

config.option("find", { type: "string", alias: "f" })
    .option("replace", { type: "string", alias: "r", default: "" })
    .option("dry-run", { type: "boolean", alias: "d" })
    .parseCliArgs({
        onInvalidArgs: function(args){
            log("Invalid Args: ");
            log(args.join(", "));
            valid = false;
        }
    });

if (valid && config.has("find")){
    config.get("inputFiles").forEach(function(file){
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
