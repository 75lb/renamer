var w = require("wodge");

module.exports = Results;

function Results(list){
    this.list = list || [];
    this.add = function(file){
        if (!w.exists(this.list, { before: file })){
            this.list.push({ before: file });
        }
    };
    this.beforeList = function(){
        return this.list.map(function(result){ 
            return result.before; 
        });
    };
}
