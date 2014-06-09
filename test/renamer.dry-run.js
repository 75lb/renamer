var test = require("tape"),
    renamer = require("../lib/renamer"),
    Results = renamer.Results;

test("dryRun data added", function(t){
    var resultList = [
        { before: "file1.txt", after: "file1.txt" },
        { before: "file1.txt", after: "clive.txt" },
        { before: "file2.txt", after: "clive.txt" },
        { before: "file3.txt", after: "clive3.txt" }
    ];
    var results = renamer.dryRun(new Results(resultList));
    t.deepEqual(results.list, [
        { before: "file1.txt", after: "file1.txt", renamed: false, error: "no change" },
        { before: "file1.txt", after: "clive.txt", renamed: true },
        { before: "file2.txt", after: "clive.txt", renamed: false, error: "file exists" },
        { before: "file3.txt", after: "clive3.txt", renamed: true }
    ]);
    t.end();
});
