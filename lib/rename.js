"use strict";
var Thing = require("nature").Thing,
    path = require("path"),
    util = require("util"),
    l = console.log;

function escapeRegExp(string){
    return string
        ? string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
        : "";
}

exports.rename = function(options){
    options = new exports.RenameOptions().set(options);

    if (options.valid){
        var output = [];
        options.files.forEach(function(file){
            var after,
                dirname = path.dirname(file),
                basename = path.basename(file),
                re = options.regex ? options.find : escapeRegExp(options.find),
                reOptions = "g" + (options.insensitive ? "i" : "");

            if(options.find){
                basename = basename.replace(new RegExp(re, reOptions), options.replace);
                after = path.join(dirname, basename);
            } else {
                after = path.join(dirname, options.replace);
            }

            output.push({ before: path.normalize(file), after: after });
        });
        output.forEach(function(out, fileIndex){
            if (out.after){
                out.after = out.after.replace("{{index}}", fileIndex + 1);
            }
        });
        return output;
    } else {
        throw new Error("Invalid rename options: " + options.validationMessages);
    }
};

exports.RenameOptions = function(){
    this.define({
            name: "files",
            type: Array,
            required: true,
            defaultOption: true
        })
        .define({ name: "find", type: "string", alias: "f" })
        .define({ name: "replace", type: "string", alias: "r", default: "" })
        .define({ name: "regex", type: "boolean", alias: "e" })
        .define({ name: "insensitive", type: "boolean", alias: "i" });
};
util.inherits(exports.RenameOptions, Thing);