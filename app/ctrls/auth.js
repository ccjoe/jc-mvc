var auth = require('../models/auth');

exports.login = function (req, res, args) {
    if(req.method === 'GET'){
        return;
    }else if(req.method === 'POST'){
        return auth.validAuth(req, res).then(function(info, user){
            return {
                info: info,
                user: user
            }
        });
    } 
};