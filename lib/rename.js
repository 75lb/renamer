"use strict";
var fs = require("fs"),
    Thing = require("nature").Thing,
    path = require("path"),
    l = console.log;

exports.rename = function(options){
    options = new exports.RenameOptions()
        .on("error", function(err){
            throw err;
        })
        .set(options);
    
    if (options.valid){
        var output = [];
        options.files.forEach(function(file){
            var after;
            
            if (options.new || !options.find){
                if (options.find){
                    var re = new RegExp(options.find),
                        matches = file.match(re);
                    if (matches){
                        matches.shift();
                        after = options.new;
                        matches.forEach(function(match, index){
                            after = after.replace("$" + (index + 1), match);
                        });
                    }
                } else {
                    after = options.new || options.replace;
                }
            } else if (options.regex){
                after = file.replace(new RegExp(options.find, "g"), options.replace);
            } else {
                after = file;
                while (after.indexOf(options.find) !== -1){
                    after = after.replace(options.find, options.replace);
                }
            }
            
            output.push({ before: file, after: after });
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
    return new Thing()
        .define({ 
            name: "files",
            type: Array,
            required: true,
            defaultOption: true
        })
        .define({ name: "find", type: "string", alias: "f" })
        .define({ name: "replace", type: "string", alias: "r", default: "" })
        .define({ name: "regex", type: "boolean", alias: "e" })
        .define({ name: "new", type: "string", alias: "n" });
};
