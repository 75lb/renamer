"use strict";
var Thing = require("nature").Thing,
    path = require("path"),
    dope = require("console-dope"),
    util = require("util"),
    fs = require("fs"),
    Glob = require("glob").Glob,
    w = require("wodge");

exports.RenameOptions = RenameOptions;
exports.process = process;

function log(success, msg, error){
    dope.log(
        "%%%s{%s} %s %s",
        success ? "green" : "red",
        success ? w.symbol.tick : w.symbol.cross,
        msg,
        error ? "(%red{" + error + "})" : ""
    );
}
function logError(msg){
    dope.red.log(msg);
}

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
        .define({ name: "verbose", type: "boolean", alias: "v" })
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

function doRename(options, from, to){
    var newFilenames = [],
        logMsg = from + " %green{->} " + to;

    if (from === to || !to ){
        if (options.verbose) log(false, from);
    } else {
        if (fs.existsSync(to) || newFilenames.indexOf(to) > -1){
            log(false, logMsg, "file exists");
        } else {
            if (!options["dry-run"]) {
                try {
                    fs.renameSync(from, to);
                    newFilenames.push(to);
                    log(true, logMsg);
                } catch(e){
                    log(false, logMsg, e.message);
                }
            } else {
                newFilenames.push(to);
                log(true, logMsg);
            }
        }
    }
}

function renameFiles(options){
    var results;

    try {
        results = options.files
            .map(renameFile.bind(null, options))
            .map(replaceIndexToken);
    } catch (e){
        logError(e.message);
        process.exit(1);
    }

    results.forEach(function(result){
        doRename(options, result.before, result.after);
    });
}

/*
@returns {Object} fileStats Each key is an existing file, it's value either 1 or 2, meaning "file" or "directory", e.g.:

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
            logError("File does not exist: " + file);
        }
    });
    return fileStats;
}

function process(options){
    var options = new RenameOptions().set(options);

    if (!options.valid) throw new Error("Invalid options: " + options.validationMessages);
    
    if (options["dry-run"]){
        dope.negative.log("Dry run");
    }

    var fileStats = getFileStats(options.files),
        files = w.pluck(fileStats, function(val){ return val === 1; }),
        dirs = w.pluck(fileStats, function(val){ return val === 2; });

    options.files = files;
    renameFiles(options);

    options.files = dirs.reverse();
    renameFiles(options);
}
