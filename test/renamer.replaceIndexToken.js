var test = require("tape"),
    renamer = require("../lib/renamer"),
    path = require("path");

var preset = {
    one: [ "file1.txt", "file2.txt", "folder/file3.txt"]
};

test("--replace: replace whole string", function(t){
    var options = {
        files: preset.one,
        replace: "{{index}}.txt"
    };
    var results = renamer.replace(options);
    results = renamer.replaceIndexToken(results);
    t.deepEqual(results.list, [
        { before: "file1.txt", after: "1.txt" },
        { before: "file2.txt", after: "2.txt" },
        { before: path.join("folder", "file3.txt"), after: path.join("folder", "3.txt") }
    ]);
    t.end();
});

test("--replace, --regex: replace whole string", function(t){
    var options = {
        files: preset.one,
        replace: "{{index}}.txt",
        regex: true
    };
    var results = renamer.replace(options);
    results = renamer.replaceIndexToken(results);
    t.deepEqual(results.list, [
        { before: "file1.txt", after: "1.txt" },
        { before: "file2.txt", after: "2.txt" },
        { before: path.join("folder", "file3.txt"), after: path.join("folder", "3.txt") }
    ]);
    t.end();
});
