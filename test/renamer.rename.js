var test = require("tape"),
    renamer = require("../lib/renamer"),
    Options = require("../lib/RenamerOptions"),
    mfs = require("more-fs"),
    w = require("wodge"),
    fs = require("fs"),
    path = require("path");

var preset = {
    one: [ "file1.txt", "file2.txt", "folder/file3.txt"]
};

function initFixture(){
    mfs.rmdir("test/fixture");
    mfs.write("test/fixture/file1.txt");
    mfs.write("test/fixture/file2.txt");
    mfs.write("test/fixture/file3.txt");
}
function _test(){
    initFixture();
    return test.apply(test, arguments);
}

_test("rename on disk", function(t){
    var resultArray = [
        { before: "test/fixture/file1.txt", after: path.join("test", "fixture", "clive1.txt") }
    ];
    var results = renamer.rename(resultArray);
    t.deepEqual(results, [
        { before: "test/fixture/file1.txt", after: path.join("test", "fixture", "clive1.txt"), renamed: true },
    ]);
    t.notOk(fs.existsSync("test/fixture/file1.txt"), "file doesn't exist");
    t.ok(fs.existsSync(path.join("test", "fixture", "clive1.txt")), "file exists");
    t.end();
});

_test("rename on disk, file exists", function(t){
    var resultArray = [
        { before: "test/fixture/file2.txt", after: "test/fixture/clive2.txt" },
        { before: "test/fixture/file3.txt", after: "test/fixture/clive2.txt" }
    ];
    var results = renamer.rename(resultArray);
    t.deepEqual(results, [
        { before: "test/fixture/file2.txt", after: "test/fixture/clive2.txt", renamed: true },
        { before: "test/fixture/file3.txt", after: "test/fixture/clive2.txt", renamed: false, error: "file exists" }
    ]);
    
    t.notOk(fs.existsSync("test/fixture/file2.txt"), "file doesn't exist");
    t.ok(fs.existsSync("test/fixture/clive2.txt"), "file exists");
    t.ok(fs.existsSync("test/fixture/file3.txt"), "file exists");
    t.end();
});

_test("no .after specified", function(t){
    var resultArray = [
        { before: "test/fixture/file1.txt" }
    ];
    var results = renamer.rename(resultArray);
    t.deepEqual(results, [
        { before: "test/fixture/file1.txt", renamed: false, error: "no change" }
    ]);
    t.end();
});

_test("crap input", function(t){
    var resultArray = [
        { before: "sdfsdg", after: "dsfkhdlkfh" }
    ];
    var results = renamer.rename(resultArray);
    t.equal(results[0].before, "sdfsdg");
    t.equal(results[0].after, "dsfkhdlkfh");
    t.equal(results[0].renamed, false);
    t.ok(/ENOENT/.test(results[0].error));
    t.end();
});
