var rename = require("../lib/rename"),
    path = require("path"),
    assert = require("assert");

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
            {
                before: path.join("clive", "clive.txt"),
                after: path.join("clive", "hater.txt")
            },
            {
                before: path.join("clive", "clive", "clive.txt"),
                after: path.join("clive", "clive", "hater.txt")
            },
            {
                before: path.join("clive", "clive", "clive", "clive.txt"),
                after: path.join("clive", "clive", "clive", "hater.txt")
            }
        ]);
    });

    it("case-insensitive find", function(){
        var args = [
            "--find", "CLIve", "--replace", "hater", "-i",
            "clive/clive.txt",
            "clive/clive/clive.txt",
            "clive/clive/clive/clive.txt"
        ];
        assert.deepEqual(rename.rename(args), [
            {
                before: path.join("clive", "clive.txt"),
                after: path.join("clive", "hater.txt")
            },
            {
                before: path.join("clive", "clive", "clive.txt"),
                after: path.join("clive", "clive", "hater.txt")
            },
            {
                before: path.join("clive", "clive", "clive", "clive.txt"),
                after: path.join("clive", "clive", "clive", "hater.txt")
            }
        ]);
    });
});

describe("rename --regex --find <regex> --replace <string>", function(){
    it("replace simple string pattern in files", function(){
        var args = [
            "--find", "clive", "--replace", "hater", "--regex",
            "file clive 1.txt",
            "&*123file clive 2.txt",
            "clicclicclivehater.avi"
        ];
        assert.deepEqual(rename.rename(args), [
            { before: "file clive 1.txt", after: "file hater 1.txt" },
            { before: "&*123file clive 2.txt", after: "&*123file hater 2.txt" },
            { before: "clicclicclivehater.avi", after: "clicclichaterhater.avi" }
        ]);

    });

    it("replace simple string pattern in deep files", function(){
        var args = [
            "--find", "clive", "--replace", "hater", "--regex",
            "clive/&*123file clive 2.txt",
            "clive/hater/clicclicclivehater.avi"
        ];
        assert.deepEqual(rename.rename(args), [
            {
                before: path.join("clive", "&*123file clive 2.txt"),
                after: path.join("clive", "&*123file hater 2.txt")
            },
            {
                before: path.join("clive", "hater", "clicclicclivehater.avi"),
                after: path.join("clive", "hater", "clicclichaterhater.avi")
            }
        ]);
    });

    it("replace all <find-string> instances", function(){
        var args = [
            "--find", "a", "--replace", "b", "--regex",
            "aaaaa", "rraarr",
            "aaa/aaaaa", "aaa/rraarr"
        ];
        assert.deepEqual(rename.rename(args), [
            { before: "aaaaa", after: "bbbbb" },
            { before: "rraarr", after: "rrbbrr" },
            { before: path.join("aaa", "aaaaa"), after: path.join("aaa", "bbbbb") },
            { before: path.join("aaa", "rraarr"), after: path.join("aaa", "rrbbrr") }
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

    it("case-insensitive find", function(){
        var args = [
            "--find", "clive", "--replace", "hater", "-i", "--regex",
            "file CLIVe 1.txt", "&*123file clIVe 2.txt", "clicclicClivEhater.avi"
        ];
        assert.deepEqual(rename.rename(args), [
            { before: "file CLIVe 1.txt", after: "file hater 1.txt" },
            { before: "&*123file clIVe 2.txt", after: "&*123file hater 2.txt" },
            { before: "clicclicClivEhater.avi", after: "clicclichaterhater.avi" }
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

describe("error handling", function(){
    it("should handle crap input", function(){
        assert.throws(function(){
            rename.rename("ldjf", 1, true);
        });
        assert.throws(function(){
            rename.rename({ file: "clive.txt", find: "i", r: "o" });
        });
        assert.doesNotThrow(function(){
            rename.rename({ files: "clive.txt", find: "i", r: "o" });
        });
    });
    it("should not loop infinitly", function(){
        rename.rename({ files: "bb.txt", find: "bb", replace: "bb" });
        assert.ok(true);
    });
});
