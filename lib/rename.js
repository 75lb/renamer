"use strict";
var Thing = require("nature").Thing,
    path = require("path"),
    util = require("util"),
    w = require("wodge");

exports.RenameOptions = RenameOptions;
exports.rename = rename;

function RenameOptions(){
    this.define({
            name: "files",
            type: Array,
            defaultOption: true,
            value: []
        })
        .define({ name: "find", type: "string", alias: "f" })
        .define({ name: "replace", type: "string", alias: "r", value: "" })
        .define({ name: "regex", type: "boolean", alias: "e" })
        .define({ name: "insensitive", type: "boolean", alias: "i" });
}
util.inherits(RenameOptions, Thing);

/**
Search globally by default. If `options.regex` is not set then ensure any special regex characters in `options.find` are escaped.
*/
function regExBuilder(options){
    var re = options.regex ? options.find : w.escapeRegExp(options.find),
        reOptions = "g" + (options.insensitive ? "i" : "");
    return new RegExp(re, reOptions);
}

/**
Perform the replace, on the basename only. If no `options.find` is supplied, the entire basename is replaced by `options.replace`. 
@returns {Object} beforeAfter An object containing the input path before and after the rename. 
*/
function renameFile(options, file){
    var after,
        dirname = path.dirname(file),
        basename = path.basename(file),
        re = regExBuilder(options);

    if(options.find){
        basename = basename.replace(re, options.replace);
        after = path.join(dirname, basename);
    } else {
        after = path.join(dirname, options.replace);
    }

    return { before: path.normalize(file), after: after };
}

function replaceIndexToken(beforeAfter, index){
    if (beforeAfter.after){
        beforeAfter.after = beforeAfter.after.replace("{{index}}", index + 1);
    }
    return beforeAfter;
}

function rename(options){
    options = new RenameOptions().set(options);

    if (options.valid){
        var output = options.files
            .map(renameFile.bind(null, options))
            .map(replaceIndexToken);
        return output;
    } else {
        throw new Error("Invalid rename options: " + options.validationMessages);
    }
}
