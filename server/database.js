/**
 * Created by yangli on 5/02/15.
 */
/* jshint ignore:start */

/*
 * created a mini paper database for demo purposes
 */

var fs = require('fs');

module.exports.write = function(data){
    fs.writeFileSync("./server/data.txt", JSON.stringify(data))
};

module.exports.read = function(){
    return fs.readFileSync('./server/data.txt');
};
