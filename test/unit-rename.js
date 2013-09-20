var rename = require("../lib/rename"),
    assert = require("assert");

describe("rename <find-string> <replace-string>", function(){
    it("replace simple string pattern in files", function(){
        var args = [
            "--find", "clive", "--replace", "hater", 
            "file clive 1.txt", "&*123file clive 2.txt", "clicclicclivehater.avi"
        ];
        assert.deepEqual(rename.rename(args), [
            { before: "file clive 1.txt", after: "file hater 1.txt" },
            { before: "&*123file clive 2.txt", after: "&*123file hater 2.txt" },
            { before: "clicclicclivehater.avi", after: "clicclichaterhater.avi" }
        ]);
        
    });
    
    it("replace complex string pattern in files", function(){
        var args = [
            "--find", "[]()£$%^", "--replace", "[].*$%^", 
            "...[]()£$%^...", "++[]()£$%^++"
        ];
        assert.deepEqual(rename.rename(args), [
            { before: "...[]()£$%^...", after: "...[].*$%^..." },
            { before: "++[]()£$%^++", after: "++[].*$%^++" }
        ]);
    });
    
    it("replace all <find-string> instances", function(){
        var args = [
            "--find", "a", "--replace", "b", 
            "aaaaa", "rraarr"
        ];
        assert.deepEqual(rename.rename(args), [
            { before: "aaaaa", after: "bbbbb" },
            { before: "rraarr", after: "rrbbrr" }
        ]);
    });
});

describe("rename --regex <find-string> <replace-string>", function(){
    it("replace simple string pattern in files", function(){
        var args = [
            "--find", "clive", "--replace", "hater", "--regex", 
            "file clive 1.txt", "&*123file clive 2.txt", "clicclicclivehater.avi"
        ];
        assert.deepEqual(rename.rename(args), [
            { before: "file clive 1.txt", after: "file hater 1.txt" },
            { before: "&*123file clive 2.txt", after: "&*123file hater 2.txt" },
            { before: "clicclicclivehater.avi", after: "clicclichaterhater.avi" }
        ]);
        
    });
    
    it("replace all <find-string> instances", function(){
        var args = [
            "--find", "a", "--replace", "b", "--regex", 
            "aaaaa", "rraarr"
        ];
        assert.deepEqual(rename.rename(args), [
            { before: "aaaaa", after: "bbbbb" },
            { before: "rraarr", after: "rrbbrr" }
        ]);
    });
});

describe("rename --regex --find <string> --new <string>", function(){
   it("create new name, using regex match", function(){
       var args = [
           "--find", "_(\\d\\d)_", "--new", "File $1",
           "--regex", "[gg]_Clive_no_Hater_-_23_[38881CD2].mp4"
       ];
       assert.deepEqual(rename.rename(args), [
           { before: "[gg]_Clive_no_Hater_-_23_[38881CD2].mp4", after: "File 23" }
       ]);
   });
});
