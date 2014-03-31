var w = require("wodge");

module.exports = Results;

function Results(list){
    this.list = list || [];
    this.add = function(files){
        var self = this;
        w.arrayify(files).forEach(function(file){
            if (!w.exists(self.list, { before: file })){
                self.list.push({ before: file });
            }
        });
    };
    this.beforeList = function(){
        return w.pluck(this.list, "before");
    };
    this.afterList = function(){
        return w.pluck(this.list, "after", "before");
    };
}
