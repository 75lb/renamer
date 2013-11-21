"use strict";
var fs = require("fs"),
    Thing = require("nature").Thing,
    path = require("path"),
    util = require("util"),
    l = console.log;

exports.rename = function(options){
    options = new exports.RenameOptions().set(options);

    if (options.valid){
        var output = [];
        options.files.forEach(function(file){
            var after,
                dirname = path.dirname(file),
                basename = path.basename(file);

            if (options.regex){
                if(options.find){
                    basename = basename.replace(new RegExp(options.find, "g"), options.replace);
                    after = path.join(dirname, basename);
                } else {
                    after = path.join(dirname, options.replace);
                }
            } else {
                if(options.find){
                    var maxIterations = 20,
                        i = 0;
                    while (basename.indexOf(options.find) !== -1 && i < maxIterations){
                        basename = basename.replace(options.find, options.replace);
                        i++;
                    }
                    after = path.join(dirname, basename);
                } else {
                    after = path.join(dirname, options.replace);
                }
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
        .define({ name: "regex", type: "boolean", alias: "e" });
};
util.inherits(exports.RenameOptions, Thing);