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
