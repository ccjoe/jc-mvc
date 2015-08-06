var path = require('path'),
    rootPath = path.normalize(__dirname + '/app'),
    staticPath = path.normalize(__dirname + '/static/'),
    // staticPathPro = staticPathTest = path.normalize(__dirname + '/static/dist/'),
    viewPath = path.normalize(__dirname + '/static/views/');
    env = process.env.NODE_ENV || 'dev';
var config = {
    dev: {
        //应用配置
        app: {
            name: 'JC-MVC',
            port: 1337,
            host: '127.0.0.1',
            dir: {
                root: rootPath,     //根目录
                stat: staticPath,   //静态资源目录
                view: viewPath,     //模板目录
            }
        },
        //数据库相关配置
        db: {
            host: '127.0.0.1',
            port: '27017'
        },
        //需要经过用户登录的部分目录
        access: [
           '/user/',
           '/setting/user'
        ],            
        //Restful url前缀，即带此前缀的url都是restful服务，且无restful资源无关，即与model操作无关型uri前缀;
        restUriPrefix: '/api'   
    },
    test: {
        app: {
            name: 'JC-MVC', 
            port: 1337,
            host: '127.0.0.1',
            root: rootPath,
        },
        db: {
            host: '127.0.0.1',
            port: '27017'
        }
    },
    production:{
        app: {
            name: 'JC-MVC', 
            port: 1337,
            host: '127.0.0.1',
            root: rootPath
        },
        db: {
            host: '127.0.0.1',
            port: '27017'
        }
    }
};

module.exports = config[env];