var jc = require('jcmvc');
var config = jc.config = require('./config');  //引入配置文件

// var auth = require('./app/auth/auth-model');
    
var passport = require('passport')
   ,LocalStrategy = require('passport-local').Strategy
   ,cookieParser = require('cookie-parser')
   ,bodyParser = require('body-parser')
   ,session = require('express-session');


var app = jc.app();

//权限策略初始化
// auth.init();

//引入中间件
app.use(cookieParser()); /*options {name: 'session', keys: ['secret1', 'secret2']}*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "need change", cookie: { maxAge: 600000 }, resave: false}));
app.use(passport.initialize());
app.use(passport.session());
//静态文件
app.use('/static', jc.staticServe(config.path.stat, {
	maxAge: 0,
	fallthrough: false
	// setHeaders: setCustomCacheControl
}));
//使用自定义的认证过滤
// app.use(auth.isAuthenticated);
//restful服务 header设置
app.use(config.restUriPrefix, jc.setHeaderRest);
//启动服务
jc.server(app);
