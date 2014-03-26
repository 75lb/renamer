"use strict";
/** @module renamer */
var Model = require("nature").Model,
    path = require("path"),
    util = require("util"),
    fs = require("fs"),
    Result = require("./Result"),
    mfs = require("more-fs"),
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
@alias module:renamer.Renamer
*/
function Renamer(options){
    this._options = new RenameOptions().set(options);
    if (!this._options.valid) throw new Error("Invalid options: " + this._options.validationMessages);
}

/**
@returns {Array} An array of result objects
@example
    [
        { before: "file1.txt", after: "clive.txt", renamed: false, error: "file exists" }
        { before: "file2.txt", after: "clive2.txt", renamed: true }
    ]
*/
Renamer.prototype.process = function(){
    var options = this._options,
        fileStats = new mfs.FileStats(options.files);

    options.files = fileStats.files
        .concat(fileStats.dirs.reverse())
        .map(function(file){ return { before: file }; });

    var results = options.files
        .map(this._renameFile.bind(this))
        .map(replaceIndexToken)
        .map(this._dryRun.bind(this))
        .map(this._renameOnDisk.bind(this));

    return results;
};

/**
Perform the replace, on the basename only. If no `options.find` is supplied, the entire basename is replaced by `options.replace`.
@param {ResultObject} result 
@returns {ResultObject} An object containing the input path before and after the rename.
*/
Renamer.prototype._renameFile = function(result, index, resultsSoFar){
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
    result.renamed = true;

    return result;
};

Renamer.prototype._dryRun = function(result, index, resultsSoFar){
    var existing = resultsSoFar.filter(function(prevResult, prevIndex){
        return prevIndex < index && (prevResult.before !== result.before) && (prevResult.after === result.after);
    });

    if (result.before === result.after ){
        result.renamed = false;
    } else if (existing.length || fs.existsSync(result.after)){
        result.renamed = false;
        result.error = "file exists";
    }

    return result;
};


/**
Perform the replace, on disk. Sets the `renamed` and/or `error` properties on the resultObject.
@param {ResultObject} result
@returns {ResultObject}
*/
Renamer.prototype._renameOnDisk = function(result){
    var options = this._options;

    if (!options["dry-run"] && result.renamed === true) {
        try {
            fs.renameSync(result.before, result.after);
        } catch(e){
            result.renamed = false;
            result.error = e.message;
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

/**
Search globally by default. If `options.regex` is not set then ensure any special regex characters in `options.find` are escaped.
*/
function regExBuilder(options){
    var re = options.regex ? options.find : w.escapeRegExp(options.find),
        reOptions = "g" + (options.insensitive ? "i" : "");
    return new RegExp(re, reOptions);
}
