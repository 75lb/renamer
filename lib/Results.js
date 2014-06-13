var a = require("array-tools");

module.exports = Results;

function Results(list){
    this.list = list || [];
    this.add = function(files){
        var self = this;
        a.arrayify(files).forEach(function(file){
            if (!a.exists(self.list, { before: file })){
                self.list.push({ before: file });
            }
        });
    };
    this.beforeList = function(){
        return a.pluck(this.list, "before");
    };
    this.afterList = function(){
        return a.pluck(this.list, "after", "before");
    };
}
