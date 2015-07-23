var config = require('../../config');
var Jc = require('../../jc');

var db = Jc.db(config, 'blog');
var collection = db.collection('user');

var userSets = {
    list : function (req, res, next) {
        collection.find({}).toArray(next);
    },
    view : function (req, res, next) {
        collection.findOne({name: req.name}, next);
    }
};

module.exports = Jc.promisifyModel(userSets);
