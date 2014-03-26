var Model = require("nature").Model,
    util = require("util");

module.exports = RenamerOptions;

function RenamerOptions(values){
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
        .define({ name: "insensitive", type: "boolean", alias: "i" })
        .set(values);
}
util.inherits(RenamerOptions, Model);
