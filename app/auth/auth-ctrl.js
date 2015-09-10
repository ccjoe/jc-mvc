var auth = require('./auth-model');
var Msg = require('../models/msg');

exports.login = function (req, res) {
    if(req.method === 'GET'){
        return;
    }else if(req.method === 'POST'){
        return auth.validAuth(req, res).then(function(data){
            return Msg(data)
        });
    } 
};