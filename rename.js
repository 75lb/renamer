#!/usr/local/bin/node

var fs = require("fs"),
	util = require("util"),
	argv = require("optimist")
		.usage("Usage: rename [-d] -f <find string> -r <replace string> <files>")
		.options("f", { string: true, describe: "find string", demand: true })
		.options("r", { string: true, default: "", describe: "replacement string" })
		.options("d", { boolean: true, describe: "dry run" })
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
