#!/usr/bin/env node

var fs = require("fs"),
    path = require("path");

[1,2,3,4,5].forEach(function(number){
    var fileName = path.join("fixture", "file" + number + ".test");
    fs.writeFileSync(fileName, "");
});