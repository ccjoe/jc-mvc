var jc = require('jcmvc');
var config = jc.config = require('./config');  //引入配置文件
//去掉了中间件及认证服务，仅作为web模块化管理工具环境。
//启动服务
jc.server(jc.app());
