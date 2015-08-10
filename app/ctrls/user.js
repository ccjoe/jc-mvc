var userModel = require('../models/user');
var Msg = require('../models/msg');
// MVC CTRL BEGIN***********************************************************
exports.index = function(req, res){
    return {
        
    };
}

exports.list = function (req, res) {
    return userModel.list(req, res).then(function(list){
        return list;
    });
}

exports.add = function (req, res) {
    if(req.method === 'POST'){
        res.sendType = 'PAGE';
        return userModel.create(req, res).then(function(data){
            return new Msg.pageMessage({
                msg: '新增成功',
                data: data
            });
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