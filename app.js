var config = require('./config'),
    jc = require('./jc'),
    auth = require('./app/models/auth');
    
var passport = require('passport')
   ,LocalStrategy = require('passport-local').Strategy
   ,cookieParser = require('cookie-parser')
   ,bodyParser = require('body-parser')
   ,session = require('express-session');

var app = jc.app();

//权限策略初始化
auth.init();

//引入中间件
app.use(cookieParser()); /*options {name: 'session', keys: ['secret1', 'secret2']}*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "need change"}));
app.use(passport.initialize());
app.use(passport.session());
console.log(config.app.dir.stat, 'config.app.dir.stat');
//静态文件
app.use(jc.staticServe(config.app.dir.stat));
//使用自定义的认证过滤
app.use(auth.isAuthenticated);
//restful服务 header设置
app.use(config.restUriPrefix, jc.setHeaderRest);
//启动服务
jc.server(app);
