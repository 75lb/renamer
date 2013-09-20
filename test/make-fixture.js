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

fs.writeFileSync("fixture/[#f1ipping4nn0y1ing].file_name-format_--23[$$$$!].mkv", dummyContent);
fs.writeFileSync("fixture/[gg]_Shingeki_no_Kyojin_-_23_[38881CD2].mp4", dummyContent);
