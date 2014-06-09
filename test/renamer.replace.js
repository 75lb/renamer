var test = require("tape"),
    renamer = require("../lib/renamer"),
    path = require("path");

var preset = {
    one: [ "file1.txt", "file2.txt", "folder/file3.txt"],
    two: [ "...[]()£$%^...", "++[]()£$%^++" ],
    three: [ "aaaaa", "rraarr" ],
    four: [ "clive/clive.txt", "clive/clive/clive.txt", "clive/clive/clive/clive.txt" ]
};

test("--find, --replace: find string not found, nothing replaced", function(t){
    var options = {
        files: preset.one,
        find: "blah",
        replace: "clive"
    };

    var results = renamer.replace(options);
    t.deepEqual(results.list, [
        { before: "file1.txt" },
        { before: "file2.txt" },
        { before: path.join("folder", "file3.txt") }
    ]);

    t.end();
});

test("--find, --replace: simple replace", function(t){
    var options = {
        files: preset.one,
        find: "file",
        replace: "clive"
    };

    var results = renamer.replace(options);
    t.deepEqual(results.list, [
        { before: "file1.txt", after: "clive1.txt" },
        { before: "file2.txt", after: "clive2.txt" },
        { before: path.join("folder", "file3.txt"), after: path.join("folder", "clive3.txt") }
    ]);
    t.end();
});

test("--find, --replace, --insensitive: simple replace", function(t){
    var options = {
        files: preset.one,
        find: "FILE",
        replace: "clive"
    };

    var results = renamer.replace(options);
    t.deepEqual(results.list, [
        { before: "file1.txt" },
        { before: "file2.txt" },
        { before: path.join("folder", "file3.txt") }
    ]);

    options.insensitive = true;
    results = renamer.replace(options);
    t.deepEqual(results.list, [
        { before: "file1.txt", after: "clive1.txt" },
        { before: "file2.txt", after: "clive2.txt" },
        { before: path.join("folder", "file3.txt"), after: path.join("folder", "clive3.txt") }
    ]);
    t.end();
});

test("--find, --replace: regex chars in files", function(t){
    var options = {
        files: preset.two,
        find: "[]()£$%^",
        replace: "[].*$%^"
    };
    t.deepEqual(renamer.replace(options).list, [
        { before: "...[]()£$%^...", after: "...[].*$%^..." },
        { before: "++[]()£$%^++", after: "++[].*$%^++" }
    ]);
    t.end();
});


test("--find, --replace: replace all <find-string> instances", function(t){
    var options = {
        files: preset.three,
        find: "a",
        replace: "b"
    };
    t.deepEqual(renamer.replace(options).list, [
        { before: "aaaaa", after: "bbbbb" },
        { before: "rraarr", after: "rrbbrr" }
    ]);
    t.end();
});

test("--find, --replace: replace simple string pattern in deep files", function(t){
    var options = {
        files: preset.four,
        find: "clive",
        replace: "hater"
    };
    t.deepEqual(renamer.replace(options).list, [
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
    t.end();
});

test("--replace: replace whole string", function(t){
    var options = {
        files: preset.one,
        replace: "{{index}}.txt"
    };
    
    t.deepEqual(renamer.replace(options).list, [
        { before: "file1.txt", after: "{{index}}.txt" },
        { before: "file2.txt", after: "{{index}}.txt" },
        { before: path.join("folder", "file3.txt"), after: path.join("folder", "{{index}}.txt") }
    ]);
    t.end();
});

/* WITH REGEX */
test("--find, --replace, --regex: find string not found, nothing replaced", function(t){
    var options = {
        files: preset.one,
        find: "blah",
        replace: "clive",
        regex: true
    };

    var results = renamer.replace(options);
    t.deepEqual(results.list, [
        { before: "file1.txt" },
        { before: "file2.txt" },
        { before: path.join("folder", "file3.txt") }
    ]);

    t.end();
});

test("--find, --replace, --regex: simple replace", function(t){
    var options = {
        files: preset.one,
        find: "file",
        replace: "clive",
        regex: true
    };

    var results = renamer.replace(options);
    t.deepEqual(results.list, [
        { before: "file1.txt", after: "clive1.txt" },
        { before: "file2.txt", after: "clive2.txt" },
        { before: path.join("folder", "file3.txt"), after: path.join("folder", "clive3.txt") }
    ]);
    t.end();
});

test("--find, --replace, --insensitive, --regex: simple replace", function(t){
    var options = {
        files: preset.one,
        find: "FILE",
        replace: "clive",
        regex: true
    };

    var results = renamer.replace(options);
    t.deepEqual(results.list, [
        { before: "file1.txt" },
        { before: "file2.txt" },
        { before: path.join("folder", "file3.txt") }
    ]);

    options.insensitive = true;
    results = renamer.replace(options);
    t.deepEqual(results.list, [
        { before: "file1.txt", after: "clive1.txt" },
        { before: "file2.txt", after: "clive2.txt" },
        { before: path.join("folder", "file3.txt"), after: path.join("folder", "clive3.txt") }
    ]);
    t.end();
});

test("--find, --replace, --regex: regex chars in files", function(t){
    var options = {
        files: preset.two,
        find: "[]()£$%^",
        replace: "[].*$%^",
        regex: true
    };
    t.deepEqual(renamer.replace(options).list, [
        { before: "...[]()£$%^..." },
        { before: "++[]()£$%^++" }
    ]);
    t.end();
});


test("--find, --replace, --regex: replace all <find-string> instances", function(t){
    var options = {
        files: preset.three,
        find: "a",
        replace: "b",
        regex: true
    };
    t.deepEqual(renamer.replace(options).list, [
        { before: "aaaaa", after: "bbbbb" },
        { before: "rraarr", after: "rrbbrr" }
    ]);
    t.end();
});

test("--find, --replace, --regex: replace simple string pattern in deep files", function(t){
    var options = {
        files: [ "clive/clive.txt", "clive/clive/clive.txt", "clive/clive/clive/clive.txt" ],
        find: "clive",
        replace: "hater",
        regex: true
    };
    t.deepEqual(renamer.replace(options).list, [
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
    t.end();
});

test("--find, --replace, --regex: replace all full stops beside last", function(t){
    var options = {
        files: [ "loads.of.full.stops.every.where.mp4", "loads.of.full.stops.every.where.jpeg" ],
        find: "\\.(?!\\w+$)",
        replace: " ",
        regex: true
    };
    t.deepEqual(renamer.replace(options).list, [
        {
            before: "loads.of.full.stops.every.where.mp4",
            after: "loads of full stops every where.mp4"
        },
        {
            before: "loads.of.full.stops.every.where.jpeg",
            after: "loads of full stops every where.jpeg"
        }
    ]);
    t.end();
});

test("--replace, --regex: replace whole string", function(t){
    var options = {
        files: preset.one,
        replace: "{{index}}.txt",
        regex: true
    };
    
    t.deepEqual(renamer.replace(options).list, [
        { before: "file1.txt", after: "{{index}}.txt" },
        { before: "file2.txt", after: "{{index}}.txt" },
        { before: path.join("folder", "file3.txt"), after: path.join("folder", "{{index}}.txt") }
    ]);
    t.end();
});

test("--replace, --regex: replace regex in multiple files", function(t){
    var options = {
        files: [ "1.txt", "2.jpg", "3.png" ],
        find: "\\d",
        replace: "x",
        regex: true
    };
    var result = renamer.replace(options).list;
    t.deepEqual(result, [
        { before: "1.txt", after: "x.txt" },
        { before: "2.jpg", after: "x.jpg" },
        { before: "3.png", after: "x.png" }
    ]);
    t.end();
});

test("should handle crap input", function(t){
    t.throws(function(){
        renamer.replace("ldjf", 1, true);
    });
    t.throws(function(){
        renamer.replace({ file: "clive.txt", find: "i", r: "o" });
    });
    t.doesNotThrow(function(){
        renamer.replace({ files: ["clive.txt"], find: "i", r: "o" });
    });
    t.end();
});
