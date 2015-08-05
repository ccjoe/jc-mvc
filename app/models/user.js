var jc = require('../../jc');

var db = jc.db('blog');
var collection = db.collection('user');

var userSets = {
    //导出时会将model promise化, 这里model的回调next固定为下面处理
    list : function (req, res, next) {
        collection.find({}).toArray(next);
    },
    view : function (req, res, next) {
        collection.findOne({name: req.key}, next);
    },
    //rest Model对象，定义为此模型里的rest服务，如果导出经过promisifyModel也会被promise化
    //一般情况rest Ctrl也许用不着rest Model,更有可能是共用 MVC的model
    /*  req.restIf = {
             res: getResCtrl(req, res, resource),   //对应的resource方法集合
             key: key,
             mtd: method
        }
    */
/*  rest: {
        query: function(req, res){
        
        },
        update: function(req, res){

        },
        create: function(req, res){

        },
        remove: function(req, res){

        }
    }*/
};


module.exports = jc.promisifyModel(userSets);
