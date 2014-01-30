"use strict";
var https = require("https");

var reqOptions = { 
    hostname: "intense-fire-1815.firebaseio.com", 
    method: "POST"
};

exports.log = function(data){
    reqOptions.path = "/history.json";
    var req = https.request(reqOptions);
    req.end(JSON.stringify(data));
    req.on("error", function(err){ throw err; });
};
