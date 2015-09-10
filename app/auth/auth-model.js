var jc = require('jcmvc'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var db = jc.db('blog');
var user = db.collection('user');


// passport request extended
/* 
1. logIn(user, options, callback)：用login()也可以。作用是为登录用户初始化session。options可设置session为false，即不初始化session，默认为true。
2. logOut()：别名为logout()。作用是登出用户，删除该用户session。不带参数。
3. isAuthenticated()：不带参数。作用是测试该用户是否存在于session中（即是否已登录）。若存在返回true。事实上这个比登录验证要用的更多，毕竟session通常会保留一段时间，在此期间判断用户是否已登录用这个方法就行了。
4. isUnauthenticated()：不带参数。和上面的作用相反. */
var auth = {
    init: function() {
        passport.use(new LocalStrategy({
            // options参数，用来设置你要验证的字段名称，即usernameField
            usernameField: 'name', //如果用邮箱验证，则需要改成邮箱字段
            passwordField: 'pwd'
        }, auth.AuthUser));
        //将环境中的user.id序列化到session中，即sessionID，同时它将作为凭证存储在用户cookie中。
        passport.serializeUser(function(user, done) {
            // console.log(user, 'user');
            done(null, user.name);
        });

        //将session反序列化，参数为用户提交的sessionID，若存在则从数据库中查询user并存储与req.user中
        passport.deserializeUser(function(username, done) {
            // console.log(username, 'username');
            user.findOne({
                name: username
            }, done);
        });
    },

    //连接DB检查用户
    AuthUser: function(name, pwd, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {
            user.findOne({
                name: name
            }, function(error, user) {
                console.log(user, '验证的USER');
                if (!user) {
                    return done(null, false, {
                        msg: '用户名或邮箱 ' + name + ' 不存在'
                    });
                }
                if (user.password !== pwd) {
                    return done(null, false, {
                        msg: '密码不匹配'
                    });
                } else {
                    return done(null, user, {
                        msg: '登录成功'
                    });
                }
            });
        });
    },
    //该用户是否存在于session中（即是否已登录）
    // !!! 中间件 往下的时候需要next();
    isAuthenticated: function(req, res, next) {
        console.log(req.url, jc.access(req.url), req.isAuthenticated(), 'URL,ACCESS,Authed')
        //登录页, 名单外页, 已认证...时不需要重定向到登录
        if ((req.url === '/auth/login') || !jc.access(req.url) || req.isAuthenticated()) { 
            next();
        } else {
            // req.flash('info', 'Flash is back!');
            res.redirect('/auth/login');
            // res.writeHead(302, {
            //     'Location': '/auth/login'
            // });
            // return res.end();
        }

    },

    //验证登录,并返回这个回调
    validAuth: function(req, res, next) {
        return new Promise(function(resolve, reject) {
            //验证登录请求
            passport.authenticate('local', //name 验证策略名称
                /*options
                  session：Boolean。设置是否需要session，默认为true
                  successRedirect：String。设置当验证成功时的跳转链接
                  failureRedirect：String。设置当验证失败时的跳转链接
                  failureFlash：Boolean or String。设置为Boolean时，express-flash将调用use()里设置的message。设置为String时将直接调用这里的信息。
                  successFlash：Boolean or String。使用方法同上。*/
                {  
                    successRedirect: '/',
                    failureRedirect: '/auth/login',
                    failureFlash: true
                },
                function(err, user, info) {
                    if (err) return reject(err);
                    if (!user) {
                        console.log(err, user, info, 'ERRORUSERINFO');

                        req.session.messages = [info.msg];
                        resolve(info);
                    }
                    req.logIn(user, function(err) {
                        if (err) return reject(err);
                        resolve({
                            msg:info.message, 
                            data: user
                        });
                    });
                }
            )(req, res, next);
        });


    }
};

module.exports = auth;
// module.exports = jc.promisifyModel(auth); 这里不需要用到promise
