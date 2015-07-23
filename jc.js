var mongo = require('mongoskin');
var http = require('http');
var url = require('url');
var fs = require('fs');
var dot = require('dot');
var chalk = require('chalk');
var path = require('path');
var PATH_ROOT = path.normalize(__dirname),
    PATH_VIEW = path.normalize(PATH_ROOT + '/app/views/');


var jc = {
    //创建server
    server: function(config){
        http.createServer(function app(req, res) {
            if (req.url === '/favicon.ico') {
                return;
            }
            jc.handleMvc(req, res);
        }).listen(config.app.port, config.app.host);
        console.log(chalk.red('运行于 '+config.app.host+':' + config.app.port));
    },
    db: function(config, dbname){
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
            v: tmpl,
            c: ctrl,
            a: action,
            p: mvcLabels.p
        };
        return mvcElem;
    },
    // 处理MVC之间的融合
    handleMvc: function(req, res) {
        var mvcHandler = jc.parseMvc(req, res);
        console.log(chalk.underline.bgBlue.white('mvcHandler'), mvcHandler);
        
        if(!mvcHandler){
            return;
        }

        var tmplData = dot.template(mvcHandler.v, undefined, jc);
        if (mvcHandler.a) {
            //tmplData是一个dot.template方法，这里action执行在此方法上，可以在action里的this获取到此方法。
            var rtc = mvcHandler.a.apply(null, [req, res].concat(mvcHandler.p));
            //但是这里统一处理tmplData(data),没有在action里处理这个，仅需要在action里返回带data的promise;
            
            //判断是否promise,不是的话控制器必须返回数据object
            if(!rtc.then){
                res.end(tmplData(rtc));
                return;
            }

            rtc.then(function(data){
                //渲染带模板的数据
                res.end(tmplData(data));
            }).catch(function(error){
                chalk.bgRed(error);
            });
        } else {
            //如果没有action,也可以输出相应静态文档，但如果没有ctrl话还是会报错
            res.end(tmplData({}));
        }
    },

    //将model promise化
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

    //读取文件
    load: function(path) {
        var data = fs.readFileSync(PATH_VIEW + path);
        if (data) return data.toString();
    },
    // 渲染静态文件,返回模板
    render: function(path, data){
        var tmpl = jc.load(path);
        return dot.template(tmpl, undefined, jc)(data ? data : {});
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

module.exports = jc;
