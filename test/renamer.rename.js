var test = require("tape"),
    renamer = require("../lib/renamer"),
    Results = renamer.Results,
    mfs = require("more-fs"),
    fs = require("fs"),
    path = require("path");

function initFixture(){
    mfs.rmdir("test/fixture");
    mfs.write("test/fixture/file1.txt");
    mfs.write("test/fixture/file2.txt");
    mfs.write("test/fixture/file3.txt");
}

test("rename on disk", function(t){
    initFixture();
    var resultArray = [
        { before: "test/fixture/file1.txt", after: path.join("test", "fixture", "clive1.txt") }
    ];
    var results = renamer.rename(new Results(resultArray));
    t.deepEqual(results.list, [
        { before: "test/fixture/file1.txt", after: path.join("test", "fixture", "clive1.txt"), renamed: true },
    ]);
    t.notOk(fs.existsSync("test/fixture/file1.txt"), "file doesn't exist");
    t.ok(fs.existsSync(path.join("test", "fixture", "clive1.txt")), "file exists");
    t.end();
});

test("rename on disk, file exists", function(t){
    initFixture();
    var resultArray = [
        { before: "test/fixture/file2.txt", after: "test/fixture/clive2.txt" },
        { before: "test/fixture/file3.txt", after: "test/fixture/clive2.txt" }
    ];
    var results = renamer.rename(new Results(resultArray));
    t.deepEqual(results.list, [
        { before: "test/fixture/file2.txt", after: "test/fixture/clive2.txt", renamed: true },
        { before: "test/fixture/file3.txt", after: "test/fixture/clive2.txt", renamed: false, error: "file exists" }
    ]);
    
    t.notOk(fs.existsSync("test/fixture/file2.txt"), "file doesn't exist");
    t.ok(fs.existsSync("test/fixture/clive2.txt"), "file exists");
    t.ok(fs.existsSync("test/fixture/file3.txt"), "file exists");
    t.end();
});

test("no .after specified", function(t){
    initFixture();
    var resultArray = [
        { before: "test/fixture/file1.txt" }
    ];
    var results = renamer.rename(new Results(resultArray));
    t.deepEqual(results.list, [
        { before: "test/fixture/file1.txt", renamed: false, error: "no change" }
    ]);
    t.end();
});

test("crap input", function(t){
    initFixture();
    var resultArray = [
        { before: "sdfsdg", after: "dsfkhdlkfh" }
    ];
    var results = renamer.rename(new Results(resultArray));
    t.equal(results.list[0].before, "sdfsdg");
    t.equal(results.list[0].after, "dsfkhdlkfh");
    t.equal(results.list[0].renamed, false);
    t.ok(/ENOENT/.test(results.list[0].error), "ENOENT");
    t.end();
});
