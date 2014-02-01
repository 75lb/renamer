"use strict";
var https = require("https");

var reqOptions = { hostname: "intense-fire-1815.firebaseio.com", 
    path: "/presets.json"
};

function get(url, done){
    reqOptions.method = "GET";
    var req = https.request(reqOptions);
    req.end();
    req.on("response", function(res){
        var output = "";
        res.setEncoding("utf-8");
        res.on("data", function(chunk){
            output += chunk;
        });
        res.on("end", function(){
            done(output);
        });
    })
    req.on("error", function(err){ throw err; });    
}

exports.push = function(data){
    reqOptions.method = "POST";
    reqOptions.path = "/presets.json";
    var req = https.request(reqOptions);
    req.end(JSON.stringify(data));
    req.on("error", function(err){ throw err; });
};
exports.save = function(name, data){
    reqOptions.method = "PUT";
    reqOptions.path = "/presets/" + name + ".json";
    var req = https.request(reqOptions);
    req.end(JSON.stringify(data));
    req.on("error", function(err){ throw err; });
};
exports.list = function(done){
    get("/presets.json", function(list){
        done(JSON.parse(list));
    });
};
exports.load = function(name){
    get("/presets/" + name + ".json", function(list){
        done(list);
    });
};
