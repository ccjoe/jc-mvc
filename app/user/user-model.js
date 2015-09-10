var jc = require('jcmvc');
var genid = require('../models/genid');
var _ = require('lodash');
var db = jc.db('blog');
var collection = db.collection('user');


// var ids = db.collection('ids');
// var getNewID = function(callback){
//     ids.findAndModify({"name":'user'}, [['name','asc']], {$inc:{'id':1}},{new:true,upsert:true},callback);
// };

//Model的req里有req.key为id或标识信息，数组长度为1时即为第一个元素，否则为数组。
var userSets = {
    //导出时会将model promise化, 这里model的回调next固定为下面处理
    list : function (req, res, next) {
        var param = {};
        //mvc时,req.key可能为空数据
        if(!(void 0 === req.key || '' === req.key || req.key.length === 0)){
             param.name = req.key;
        };

        //根据条件查询，多条时返回数据，单条时返回对象；
        collection.find(param).toArray(function(err, arrResult){
            if(err)
                next(err);
            if(arrResult.length === 1)
                next(err, arrResult[0]);
            else
                next(err, arrResult);
        });
    },
    //更新单条与多条
    update: function(req, res, next){
        var param = {};
        if(!(void 0 === req.key || '' === req.key || req.key.length === 0)){
             param.name = req.key;
        };
        collection.update(param, {$set: req.body}, next);
        // getNewID();
    },

    create: function(req, res, next){
        var args = _.assign({}, req.body, {'_id':genid('userid')})
        console.log(args, 'MYAGES');
        collection.insert(req.body, next);
    },

    remove: function(req, res, next){
        var param = {};
        if(!(void 0 === req.key || '' === req.key || req.key.length === 0)){
             param.name = req.key;
        };
        collection.findAndRemove(param, next);
    }
    //rest Model对象，定义为此模型里的rest服务，如果导出经过promisifyModel也会被promise化
    //一般情况rest Ctrl也许用不着rest Model,更有可能是共用 MVC的model
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
