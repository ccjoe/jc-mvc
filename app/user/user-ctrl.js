var userModel = require('./user-model');
var Msg = require('../models/msg'),
    _ = require('lodash');

// MVC CTRL BEGIN *********************************************************
exports.index = function(req, res) {
    return {
        title: 'USER INDEX'
    };
}

exports.list = function (req, res) {
    return userModel.list(req, res).then(function(list){
        return _.assign({}, list, {title: 'USER LIST'});
    });
}

exports.edit = exports.list;

exports.add = function (req, res) {
    if(req.method === 'POST'){
        res.sendType = 'PAGE';  //指定返回页面
        if(!req.body.name){
            return _.assign({}, addLabel, Msg({
                type: 'page',
                msg: 'name不能为空'
            }));
        };

        return userModel.create(req, res).then(function(data){
            return _.assign({}, addLabel, {
                title: 'USER新增'
            }, Msg({
                type: 'page',
                msg: '新增成功'
            }));
        });
    }else{
        return;
    }
}
//list是多条，view单条，共用一个方法
exports.view = exports.list;
// MVC  CTRL END*************************************************************

// REST CRUD BEGIN***********************************************************
exports.rest = {
    query: exports.list,
    update: function(req, res){
        return userModel.update(req, res).then(function(res){
            return res;
        });
    },
    create: function(req, res){
        return userModel.create(req, res).then(function(res){
            return res;
        });
    },
    remove: function(req, res){
        return userModel.remove(req, res).then(function(res){
            return res;
        });
    }
}
// REST CRUD END*************************************************************