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
    
    it("replace simple string pattern in deep files", function(){
        var args = [
            "--find", "clive", "--replace", "hater", 
            "clive/clive.txt", 
            "clive/clive/clive.txt", 
            "clive/clive/clive/clive.txt"
        ];
        assert.deepEqual(rename.rename(args), [
            { before: "clive/clive.txt", after: "clive/hater.txt" },
            { before: "clive/clive/clive.txt", after: "clive/clive/hater.txt" },
            { before: "clive/clive/clive/clive.txt", after: "clive/clive/clive/hater.txt" }
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

describe("rename --replace <string>", function(){
    it("replace whole string", function(){
        assert.deepEqual(
            rename.rename({
                files: ["one.txt", "two.txt"],
                replace: "{{index}}.txt"
            }),
            [
                { 
                    before: "one.txt", 
                    after: "1.txt" 
                },
                { 
                    before: "two.txt", 
                    after: "2.txt" 
                }
            ]
        );
    });
});
