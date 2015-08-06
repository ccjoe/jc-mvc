var path = require('path')
    ,env = process.env.NODE_ENV || 'dev'
    ,rootPath = path.normalize(__dirname + '/app')
    ,viewPath = path.normalize(__dirname + '/static/views/')
    ,staticPath = path.normalize(__dirname + '/static/' + (env==='dev' ? 'src/' : 'dist/'));

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
    production:{
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
    }
};

module.exports = config[env];