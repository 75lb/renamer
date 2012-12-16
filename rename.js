#!/usr/local/bin/node

var fs = require("fs"),
	util = require("util"),
	argv = require("optimist")
		.usage("Usage: rename.js [-d] -f <find string> -r <replace string> <files>")
		.demand(["f"])
		.string(["f", "r"])
		.default("r", "")
		.boolean("d")
		.describe("d", "dry run")
		.describe("f", "find string")
		.describe("r", "replacement string")
		.argv;

if (argv.debug) {
	util.log(util.inspect(argv, false, null, true));
}
	
argv._.forEach(function(file){
	if(fs.existsSync(file)){
		var regEx = new RegExp(argv.f, "g"),
			newName = file.replace(regEx, argv.r);
		util.log("new filename: " + newName);
		if (!argv.d)
			fs.renameSync(file, newName);
	} else {
		util.error("file doesn't exist: " + file);
	}
});
