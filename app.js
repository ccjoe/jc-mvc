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
app.use(cookieParser(/*{
    name: 'session',
    keys: ['secret1', 'secret2']
}*/));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({secret: "need change"}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(flash());
app.use(auth.isAuthenticated);


//启动服务
jc.server(app);
