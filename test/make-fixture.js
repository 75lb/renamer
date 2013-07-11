#!/usr/bin/env node

var fs = require("fs"),
    path = require("path");

fs.readdirSync("fixture").forEach(function(file){
    fs.unlinkSync(path.join("fixture", file));
});

[1,2,3,4,5].forEach(function(number){
    var fileName = path.join("fixture", "file" + number + ".test");
    fs.writeFileSync(fileName, "some content\n");
});