var util = require("util"),
    FileSet = require("more-fs").FileSet,
    Model = require("nature").Model;

module.exports = RenameSet;

function RenameSet(){
    this.define({ name: "fileSet", type: FileSet })
        .define({ name: "find", type: "string", alias: "f", postSet: postSetFind })
        .define({ name: "replace", type: "string", alias: "r", value: "" })
        .define({ name: "regex", type: "boolean", alias: "e" })
        .define({ name: "dry-run", type: "boolean", alias: "d" })
        .define({ name: "insensitive", type: "boolean", alias: "i" })
        .set(values);

    // this.on("update", function(attr, prev, curr){
    //     if (attr === "find" || attr === "replace"){
    //         
    //     }
    // });
}
util.inherits(RenameSet, Model);

function postSetFind(newValue, oldValue){
    this.fileSet.forEach(function(file){
        
    });
}