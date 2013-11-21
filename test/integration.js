var spawn = require("child_process").spawn,
    assert = require("assert");

describe("integration tests", function(){
    it("should spawn without error", function(done){
        spawn("./cli.js", [ "-h" ]).on("close", function(code){
            assert.strictEqual(code, 0, "Return code: " + code);
            done();
        });
    });
});
