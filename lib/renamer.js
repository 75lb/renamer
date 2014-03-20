"use strict";
var Model = require("nature").Model,
    path = require("path"),
    util = require("util"),
    fs = require("fs"),
    Glob = require("glob").Glob,
    w = require("wodge");

exports.RenameOptions = RenameOptions;
exports.Renamer = Renamer;

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
        .define({ name: "dry-run", type: "boolean", alias: "d" })
        .define({ name: "insensitive", type: "boolean", alias: "i" });
}
util.inherits(RenameOptions, Model);

/**
@constructor
*/
function Renamer(options){
    this._options = new RenameOptions().set(options);
    if (!this._options.valid) throw new Error("Invalid options: " + this._options.validationMessages);
}

/**
@method
@return {Array} results An array of result objects
@example
    [
        { before: "file1.txt", after: "clive.txt", renamed: false, error: "file exists" }
        { before: "file2.txt", after: "clive2.txt", renamed: true }
    ]
*/
Renamer.prototype.process = function(){
    var options = this._options,
        fileStats = getFileStats(options.files),
        files = w.pluck(fileStats, function(val){ return val === 1; }),
        dirs = w.pluck(fileStats, function(val){ return val === 2; });

    options.files = files
        .concat(dirs.reverse())
        .map(function(file){ return { before: file }; });
    
    var results = options.files
        .map(this._renameFile.bind(this))
        .map(replaceIndexToken)
        .map(this._renameOnDisk.bind(this));

    return results;
};

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
Renamer.prototype._renameFile = function(result){
    var after,
        options = this._options,
        dirname = path.dirname(result.before),
        basename = path.basename(result.before),
        re = regExBuilder(options);

    if(options.find){
        basename = basename.replace(re, options.replace);
        after = path.join(dirname, basename);
    } else {
        after = path.join(dirname, options.replace);
    }
    
    result.before = path.normalize(result.before);
    result.after = after;
    return result;
};

Renamer.prototype._renameOnDisk = function(result){
    var newFilenames = [],
        options = this._options;

    if (result.before === result.after || !result.after ){
        result.renamed = false;
    } else {
        if (fs.existsSync(result.after) || newFilenames.indexOf(result.after) > -1){
            result.renamed = false;
            result.error = "file exists";
        } else {
            if (!options["dry-run"]) {
                try {
                    fs.renameSync(result.before, result.after);
                    newFilenames.push(result.after);
                    result.renamed = true;
                } catch(e){
                    result.renamed = false;
                    result.error = e.message;
                }
            } else {
                result.renamed = true;
                newFilenames.push(result.after);
            }
        }
    }
    
    return result;
};

function replaceIndexToken(result, index){
    if (result.after){
        result.after = result.after.replace("{{index}}", index + 1);
    }
    return result;
}

/*
@returns {Object} fileStats Each key is an existing file, it's value either 1 or 2, meaning "file" or "directory", e.g.:
@example
    {
        "file1": 1,
        "file2": 1,
        "folder1": 2,
        "folder1/file1": 1,
        "folder1/file2": 1
    }
*/
function getFileStats(files){
    var fileStats = {},
        existingFiles = files.filter(fs.existsSync),
        notExistingFiles = w.without(files, existingFiles);

    existingFiles.forEach(function(file){
        fileStats[file] = fs.statSync(file).isDirectory() ? 2 : 1;
    });

    notExistingFiles.forEach(function(file){
        var glob = new Glob(file, { sync: true, stat: true });
        if (glob.found.length){
            glob.found.forEach(function(file){
                fileStats[file] = glob.cache[file] instanceof Array ? 2 : 1;
            });
        } else {
            console.error("File does not exist: " + file);
        }
    });
    return fileStats;
}
