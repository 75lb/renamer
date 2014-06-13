var util = require("util"),
    s = require("string-tools"),
    path = require("path"),
    fileSet = require("file-set"),
    Model = require("nature").Model;

module.exports = Renamer;

function Renamer(values){
    this.define({ name: "fileSet", type: fileSet })
        .define({ name: "find", type: "string", alias: "f", postSet: postSetFind })
        .define({ name: "replace", type: "string", alias: "r", value: "" })
        .define({ name: "regex", type: "boolean", alias: "e" })
        .define({ name: "dry-run", type: "boolean", alias: "d" })
        .define({ name: "insensitive", type: "boolean", alias: "i" })
        .set(values);
}
util.inherits(Renamer, Model);

function postSetFind(){
    var self = this;
    this.fileSet.list.forEach(function(fileSetItem){
        fileSetItem.after = replaceSingle(
            regExBuilder(self.find, self.regex, self.insensitive),
            self.replace,
            fileSetItem.path
        );
    });
    console.dir(this.fileSet);
}

/**
Perform the replace. If no `options.find` is supplied, the entire basename is replaced by `options.replace`.
*/
function replaceSingle(findRegex, replace, file){
    var dirname = path.dirname(file),
        basename = path.basename(file);

    if(findRegex){
        if (basename.search(findRegex) > -1){
            basename = basename.replace(findRegex, replace);
            return path.join(dirname, basename);
        } else {
            /* return the original value, signifying no replace was performed */
            return file;
        }
    } else {
        return path.join(dirname, replace);
    }
}

/**
Search globally by default. If `regex` is not set then ensure any special regex characters in `find` are escaped. Do nothing if `find` is not set. 
*/
function regExBuilder(find, regex, insensitive){
    if (find){
        var re = regex ? find : s.escapeRegExp(find),
            reOptions = "g" + (insensitive ? "i" : "");
        return new RegExp(re, reOptions);
    }
}
