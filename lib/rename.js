"use strict";
var Thing = require("nature").Thing,
    path = require("path"),
    util = require("util"),
    wodge = require("wodge");

var RenameOptions = exports.RenameOptions = function(){
    this.define({
            name: "files",
            type: Array,
            defaultOption: true,
            value: [],
            invalidMsg: "Must supply at least one file, and all must exist"
        })
        .define({ name: "find", type: "string", alias: "f" })
        .define({ name: "replace", type: "string", alias: "r", value: "" })
        .define({ name: "regex", type: "boolean", alias: "e" })
        .define({ name: "insensitive", type: "boolean", alias: "i" });
};
util.inherits(RenameOptions, Thing);

exports.rename = function(options){
    options = new RenameOptions().set(options);

    if (options.valid){
        var output = [];
        options.files.forEach(function(file){
            var after,
                dirname = path.dirname(file),
                basename = path.basename(file),
                re = options.regex ? options.find : wodge.escapeRegExp(options.find),
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
