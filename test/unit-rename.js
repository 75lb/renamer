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
})