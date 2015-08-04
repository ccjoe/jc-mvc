var mongo = require('mongoskin');
var http = require('http');
var url = require('url');
var dot = require('dot');
var chalk = require('chalk');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');

var request = require('./lib/req');
var response = require('./lib/res');
var utils = require('./lib/utils');
var config = require('./config');
var connect = require('connect');

var PATH_VIEW = path.normalize(config.app.root+'/views/');

var jc = {
    req: request,
    res: response,
    init: function(req, res){
        //引入扩展的req, res
        if (req.url === '/favicon.ico') return;
        jc.handleMvc(req, res);        
    },
    //创建app, 有connect中间件时使用中间件初始app,无时直接初始化
    app: function(){
        if(connect){
            var app = connect();
            //还是使用中间件形式混合入扩展的req,res;
            app.use(function(req, res, next){
                req = _.assign(req, jc.req);
                res = _.assign(res, jc.res);
                next();
            })
            return app;
        }else{
            return function(){jc.init(req, res)}; 
        }
    },

    //创建server
    server: function(app){
        app.use(jc.init);
        //没有传入app,则从内部jc.app启动
        http.createServer(app || jc.app).listen(config.app.port, config.app.host);
        console.log(chalk.red('运行于 '+config.app.host+':' + config.app.port));
    },
    //连接DB
    db: function(dbname){
        //连接到DB的blog db
        var db = new mongo.db('mongodb://' + config.db.host + ':' + config.db.port + '/'+dbname, {safe:true});
        db.open(function (error, dbConnetion) {
            if(error){
                console.log(error);
                process.exit(1);
            }
        });

        return db;
    },

    //获取MVC各要素 对应的文件及方法名称(除model外)
    getMvcName: function(req, res) {
        var pathname = url.parse(req.url).pathname,
            paths = pathname.split('/');
        var ctrl = paths[1] || 'index', //controller
            action = paths[2] || 'index', //action
            args = paths.slice(3) || '', //arguments
            view = ctrl + '/' + action + '.html';

        var mvcName = {
            pn: pathname,
            v: view,
            c: ctrl,
            a: action,
            p: args
        };
        return mvcName;
    },

    //获取MVC各要素 对应的实体(除model外)
    parseMvc: function(req, res) {
        var mvcLabels = jc.getMvcName(req, res);
        console.log(chalk.underline.bgBlue.white('mvcName'), mvcLabels);
        try{
            var tmpl = jc.load(mvcLabels.v);
        }catch (error){
            jc.handleErr(req, res, error);
            return;
        }

        try {
            var ctrl = require('./app/ctrls/' + mvcLabels.c);
        } catch (error) {
            jc.handleErr(req, res, error);
            return;
        }
        var action = ctrl[mvcLabels.a];

        var mvcElem = {
            pn: mvcLabels.pn,
            v: tmpl,
            c: ctrl,
            a: action,
            p: mvcLabels.p
        };
        return mvcElem;
    },
    // 处理MVC之间的融合
    /* 这里决定了相应的action需要返回的数据及格式,
       GET 渲染模板
       POST 返回JOSN
       if promise 
    */

    handleMvc: function(req, res) {
        var mvcHandler = jc.parseMvc(req, res);
        console.log(chalk.underline.bgBlue.white('mvcHandler'), mvcHandler, mvcHandler.pn);
        
        if(!mvcHandler){
            return;
        };

        var tmplData = dot.template(mvcHandler.v, undefined, jc);
        if (mvcHandler.a) {
            //tmplData是一个dot.template方法，这里action执行在此方法上，可以在action里的this获取到此方法。
            // rtc 为 action 的 返回体
            var rtc = mvcHandler.a.apply(null, [req, res].concat(mvcHandler.p));
            //但是这里统一处理tmplData(data),没有在action里处理这个，仅需要在action里返回带data的promise;
            //如果之前有设置请求头，则不渲染
            console.log(rtc, 'res.headersSent');
            // if(res.headersSent){
            //     return;
            // };
            //如果 rtc为不返回任何东西，则默认渲染无数据页面
            if(!rtc){
                res.end(tmplData({}));
                return;
            };
            //如果 rtc是否promise,不是且存在的话控制器必须返回数据object
            if(!rtc.then){
                //这里认为GET是为了请求页面， POST是为了提交数据而返回结果
                sendRes(req, res, rtc);
                return;
            }

            rtc.then(function(data){
                //渲染带模板的数据
                sendRes(req, res, data);
            }).catch(function(error){
                chalk.bgRed(error);
            });
        } else {
            //如果没有action,也可以输出相应静态文档，但如果没有ctrl话还是会报错
            res.end(tmplData({}));
        }

        function sendRes(req, res, rtc){
            var method = req.method;
            if(method === 'GET')
                res.end(tmplData(rtc));
            else if(method === 'POST')
                res.json(rtc);
        }
    },

    //处理需要权限控制的URL, true,需要验证登录，false不需要
    access: function(path){
       var accessDir = config.access;
       if(accessDir || accessDir.length){
        return false
       };
       for(var i=0; i<accessDir.length; i++){
          if( !!~path.indexOf(accessDir[i]) ){
            return true;
          }
       }
       return false
    },
    //将model promise化
    //简单来讲 将model里面的每个方法 promise化重写，返回这个model方法集合
    promisifyModel: function(model) {
        for (var fn in model) {
            (function(i) {
                var modelfn = model[i]; //指向原方法的引用
                model[i] = function(req, res) {
                    return new Promise(function(resolve, reject) {
                        modelfn(req, res, function(error, data) {
                            if (!error) {
                                resolve(data);
                            } else {
                                reject(error);
                            }
                        });
                    });
                }
            })(fn)
        }
        return model;
    },

    // 渲染静态文件,返回模板
    render: function(path, data){
        var tmpl = jc.load(path);
        return dot.template(tmpl, undefined, jc)(data ? data : {});
    },
    //读取文件
    load: function(path) {
        var data = fs.readFileSync(PATH_VIEW+path);
        if (data) return data.toString();
    },

    handleErr: function(req, res, error) {
        res.writeHead(500, {
            'Content-type': 'text/html'
        });
        res.end(jc.render('public/error.html', {error: error}), 'utf-8');
    },
    //将任何方法promise化
    promisify: function(fn){
        var callback = function(){
            var args = [].prototype.slice.call(arguments);
                if(args.length <= 1){
                    resolve(args[args.length-1]);
                }else{
                    if(args[0]){
                        reject(args[0])
                    }else{
                        resolve(args.slice(1));
                    }
                }
            };

        return new Promise(function(resolve, reject) { 
            fn(callback);
        });
    },

    //TJ thunkify
    thunkify: function(fn){
      if('function' !== typeof fn){
        console.log('function required');
      }

      return function(){
        var args = new Array(arguments.length);
        var ctx = this;

        for(var i = 0; i < args.length; ++i) {
          args[i] = arguments[i];
        }

        return function(done){
          var called;

          args.push(function(){
            if (called) return;
            called = true;
            done.apply(null, arguments);
          });

          try {
            fn.apply(ctx, args);
          } catch (err) {
            done(err);
          }
        }
      }
    },
    //TJ Co
    co: function(GenFunc) {
        return function(cb) {
            var gen = GenFunc()
            next();

            function next(err, args) {
                if (err) {
                    cb(err);
                } else {
                    if (gen.next) {
                        var ret = gen.next(args);
                        if (ret.done) {
                            cb && cb(null, args)
                        } else {
                            ret.value(next);
                        }
                    }
                }
            }
        }
    }
};

exports = module.exports = jc;

