var jc = require('jcmvc');
var config = jc.config = require('./config');  //引入配置文件
//去掉了中间件及认证服务，仅作为web模块化管理工具环境。

//静态文件
var app = jc.app();
app.use(jc.staticServe(config.path.stat));

//启动服务
jc.server(app);
