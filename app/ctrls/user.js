var userModel = require('../models/user');

exports.index = function(req, res){
    return {};
}

exports.list = function (req, res, args) {
    return userModel.list(req, res).then(function(list){
        return list;
    });
}

exports.view = function (req, res, args) {
    req.name = args;
    return userModel.view(req, res).then(function(data){
        return data;
    });
}

exports.rest = {
    //rest对象，定义为此模型里的rest服务，如果导出经过promisifyModel也会被promise化
    /*  req.restIf = {
             res: getResCtrl(req, res, resource),   //对应的resource方法集合
             key: key,
             mtd: method
        }
    */
    query: function(req, res){
        console.log('REST GET QUERY:' + req.key);
    },
    update: function(req, res){

    },
    create: function(req, res){

    },
    remove: function(req, res){

    }
}