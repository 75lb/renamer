#!/usr/bin/env node

var fs = require("fs"),
    path = require("path"),
    dummyContent = "some content\n";

if (!fs.existsSync("fixture")){
    fs.mkdir("fixture");
}

fs.readdirSync("fixture").forEach(function(file){
    fs.unlinkSync(path.join("fixture", file));
});

[1,2,3,4,5].forEach(function(number){
    var fileName = path.join("fixture", "file" + number + ".test");
    fs.writeFileSync(fileName, dummyContent);
});

fs.writeFileSync("fixture/[#f1ipping4nn0y1ing].file.NAME--23[$1$$!].mkv", dummyContent);
fs.writeFileSync("fixture/[#f1ipping4nn0y1ing].file.NAME--3[$2$$!].mkv", dummyContent);
fs.writeFileSync("fixture/[#f1ipping4nn0y1ing].file.NAME--13[$3$$!].mkv", dummyContent);
fs.writeFileSync("fixture/[ag]_Annoying_filename_-_3_[38881CD1].mp4", dummyContent);
fs.writeFileSync("fixture/[eg]_Annoying_filename_-_13_[38881CD2].mp4", dummyContent);
fs.writeFileSync("fixture/[fg]_Annoying_filename_-_23_[38881CD3].mp4", dummyContent);