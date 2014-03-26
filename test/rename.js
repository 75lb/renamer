var test = require("tape"),
    renamer = require("../lib/renamer"),
    Options = require("../lib/RenamerOptions"),
    mfs = require("more-fs");

var preset = {
    one: [ "file1.txt", "file2.txt", "folder/file3.txt"]
};

mfs.rmdir("test/fixture");
mfs.write("test/fixture/file1.txt");
mfs.write("test/fixture/file2.txt");
mfs.write("test/fixture/file3.txt");

test("rename on disk", function(t){
    var resultArray = [
        { before: "test/fixture/file1.txt", after: "test/fixture/clive1.txt" },
        { before: "test/fixture/file2.txt", after: "test/fixture/clive2.txt" },
        { before: "test/fixture/file3.txt", after: "test/fixture/clive2.txt" }
    ];
    var results = renamer.rename(resultArray);
    t.deepEqual(results, [
        { before: "test/fixture/file1.txt", after: "test/fixture/clive1.txt", renamed: true },
        { before: "test/fixture/file2.txt", after: "test/fixture/clive2.txt", renamed: true },
        { before: "test/fixture/file3.txt", after: "test/fixture/clive2.txt", renamed: false, error: "file exists" }
    ]);
    t.end();
});
