"use strict";
/** @module renamer */
var mfs = require("more-fs"),
    w = require("wodge"),
    dope = require("console-dope"),
    path = require("path"),
    util = require("util"),
    fs = require("fs"),
    Result = require("./Result"),
    RenamerOptions = require("./RenamerOptions");

exports.Result = Result;
exports.RenamerOptions = RenamerOptions;
exports.replace = replace;
exports.expand = expand;
exports.rename = rename;
exports.dryRun = dryRun;
exports.replaceIndexToken = replaceIndexToken;

/**
Perform the replace. If no `options.find` is supplied, the entire basename is replaced by `options.replace`.

@alias module:renamer.replace
@param {RenamerOptions} options - Contains the file list and renaming options
@returns {Array} An array of ResultObject instances containing `before` and `after` info
*/
function replace(options){
    options = new RenamerOptions(options);
    var findRegex = regExBuilder(options);
    return options.files.map(function(file){
        var result = new Result(),
            dirname = path.dirname(file),
            basename = path.basename(file);

        if(options.find){
            if (basename.search(findRegex) > -1){
                basename = basename.replace(findRegex, options.replace);
                result.after = path.join(dirname, basename);
            } else {
                /* leave result.after blank, signifying no replace was performed */
            }
        } else {
            result.after = path.join(dirname, options.replace);
        }

        result.before = path.normalize(file);
        return result;
    });
}

function expand(files){
    var fileStats = new mfs.FileStats(files);
    fileStats.filesAndDirs = fileStats.files.concat(fileStats.dirs.reverse());
    return fileStats;
}

function dryRun(resultArray){
    return resultArray.map(function(result, index, resultsSoFar){
        var existing = resultsSoFar.filter(function(prevResult, prevIndex){
            return prevIndex < index && (prevResult.before !== result.before) && (prevResult.after === result.after);
        });

        if (result.before === result.after || !result.after){
            result.renamed = false;
            result.error = "no change";
        } else if (existing.length){
            result.renamed = false;
            result.error = "file exists";
        } else {
            result.renamed = true;
        }

        return result;
    });
}

function rename(resultArray){
    return resultArray.map(function(result){
        if (!result.after){
            result.renamed = false;
            result.error = "no change";
            return result;
        }
        try {
            if (fs.existsSync(result.after)){
                result.renamed = false;
                result.error = "file exists";
            } else {
                fs.renameSync(result.before, result.after);
                result.renamed = true;
            }
        } catch(e){
            result.renamed = false;
            result.error = e.message;
        }
        return result;
    });
}

function replaceIndexToken(resultArray){
    return resultArray.map(function(result, index){
        if (result.after){
            result.after = result.after.replace("{{index}}", index + 1);
        }
        return result;
    });
}

/**
Search globally by default. If `options.regex` is not set then ensure any special regex characters in `options.find` are escaped.
*/
function regExBuilder(options){
    var re = options.regex ? options.find : w.escapeRegExp(options.find),
        reOptions = "g" + (options.insensitive ? "i" : "");
    return new RegExp(re, reOptions);
}
