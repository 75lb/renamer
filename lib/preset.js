"use strict";
var https = require("https");

var reqOptions = { 
    hostname: "intense-fire-1815.firebaseio.com", 
    path: "/presets.json"
};

exports.save = function(data){
    reqOptions.method = "POST";
    var req = https.request(reqOptions);
    req.end(JSON.stringify(data));
    req.on("error", function(err){ throw err; });
};
exports.list = function(done){
    reqOptions.method = "GET";
    var req = https.request(reqOptions);
    req.end();
    req.on("response", function(res){
        var list = "";
        res.setEncoding("utf-8");
        res.on("data", function(chunk){
            list += chunk;
        });
        res.on("end", function(){
            done(JSON.parse(list));
        });
    })
    req.on("error", function(err){ throw err; });
};
