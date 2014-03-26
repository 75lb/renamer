var test = require("tape"),
    renamer = require("../lib/renamer"),
    Options = require("../lib/RenamerOptions");

var preset = {
    one: [ "file1.txt", "file2.txt", "folder/file3.txt"]
};

test("dryRun data added", function(t){
    var resultArray = [
        { before: "file1.txt", after: "file1.txt" },
        { before: "file1.txt", after: "clive.txt" },
        { before: "file2.txt", after: "clive.txt" },
        { before: "file3.txt", after: "clive3.txt" }
    ];
    var results = renamer.dryRun(resultArray);
    t.deepEqual(results, [
        { before: "file1.txt", after: "file1.txt", renamed: false, error: "no change" },
        { before: "file1.txt", after: "clive.txt", renamed: true },
        { before: "file2.txt", after: "clive.txt", renamed: false, error: "file exists" },
        { before: "file3.txt", after: "clive3.txt", renamed: true }
    ]);
    t.end();
});
