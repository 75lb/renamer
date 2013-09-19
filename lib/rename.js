var fs = require("fs"),
    Thing = require("nature").Thing,
    path = require("path");

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
            if (options.regex){
                after = file.replace(new RegExp(options.find, "g"), options.replace);
            } else {
                after = file;
                while (after.indexOf(options.find) !== -1){
                    after = after.replace(options.find, options.replace);
                }
            }
            output.push({ before: file, after: after });
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
        .define({ name: "regex", type: "boolean", alias: "e" });
};
