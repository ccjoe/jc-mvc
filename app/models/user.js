var jc = require('../../jc');

var db = jc.db('blog');
var collection = db.collection('user');

var userSets = {
    //导出时会将model promise化, 这里model的回调next固定为下面处理
    list : function (req, res, next) {
        collection.find({}).toArray(next);
    },
    view : function (req, res, next) {
        collection.findOne({name: req.name}, next);
    }
};

module.exports = jc.promisifyModel(userSets);
