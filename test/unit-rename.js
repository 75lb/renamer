var rename = require("../lib/rename"),
    assert = require("assert"),
    l = console.log;

describe("rename --find <string> --replace <string>", function(){
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

describe("rename --regex --find <regex> --replace <string>", function(){
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

    it("replace all full stops beside last", function(){
        var args = [
            "--find", "\\.(?!\\w+$)", "--replace", " ", "--regex", 
            "loads.of.full.stops.every.where.mp4",
            "loads.of.full.stops.every.where.jpeg"
        ];
        l(rename.rename(args))
        assert.deepEqual(rename.rename(args), [
            { 
                before: "loads.of.full.stops.every.where.mp4", 
                after: "loads of full stops every where.mp4" 
            },
            { 
                before: "loads.of.full.stops.every.where.jpeg", 
                after: "loads of full stops every where.jpeg" 
            }
        ]);
    });    
});

describe("rename --regex --find <regex> --new <string>", function(){
   it("create new name, using regex match", function(){
       var args = [
           "--find", "_(\\d{1,2})_", "--new", "$1 - File",
           "--regex", 
           "[ga]_Clive_no_Hater_-_23_[38881CD2].mp4", 
           "[ga]_Clive_no_Hater_-_13_[38881CD2].mp4",
           "[ga]_Clive_no_Hater_-_3_[38881CD2].mp4"
       ];
       assert.deepEqual(rename.rename(args), [
           { before: "[ga]_Clive_no_Hater_-_23_[38881CD2].mp4", after: "23 - File" },
           { before: "[ga]_Clive_no_Hater_-_13_[38881CD2].mp4", after: "13 - File" },
           { before: "[ga]_Clive_no_Hater_-_3_[38881CD2].mp4", after: "3 - File" }
       ]);
   });
});

describe("rename --find <regex> --new <string>", function(){
   it("create new name, using regex match, --regex implied", function(){
       var args = [
           "--find", "_(\\d{1,2})_", "--new", "$1 - File",
           "[ga]_Clive_no_Hater_-_23_[38881CD2].mp4", 
           "[ga]_Clive_no_Hater_-_13_[38881CD2].mp4",
           "[ga]_Clive_no_Hater_-_3_[38881CD2].mp4"
       ];
       assert.deepEqual(rename.rename(args), [
           { before: "[ga]_Clive_no_Hater_-_23_[38881CD2].mp4", after: "23 - File" },
           { before: "[ga]_Clive_no_Hater_-_13_[38881CD2].mp4", after: "13 - File" },
           { before: "[ga]_Clive_no_Hater_-_3_[38881CD2].mp4", after: "3 - File" }
       ]);
   });
});

describe("rename --new <string>", function(){
   it("simple new name", function(){
       var args = [
           "--new", "clive",
           "file1.txt", "file2.txt", "file3.txt"
       ];
       assert.deepEqual(rename.rename(args), [
           { before: "file1.txt", after: "clive" },
           { before: "file2.txt", after: "clive" },
           { before: "file3.txt", after: "clive" }
       ]);
   });
   
   it("simple new name, with an {{index}}", function(){
       var args = [
           "--new", "clive {{index}}",
           "file1.txt", "file2.txt", "file3.txt"
       ];
       assert.deepEqual(rename.rename(args), [
           { before: "file1.txt", after: "clive 1" },
           { before: "file2.txt", after: "clive 2" },
           { before: "file3.txt", after: "clive 3" }
       ]);
   });
});