var path = require('path')
    ,_ = require('lodash')
    ,env = process.env.NODE_ENV || 'dev'
    ,rootPath = path.normalize(__dirname + '/app/')
    ,viewPath = path.normalize(__dirname + '/static/views/')
    ,staticPath = path.normalize(__dirname + '/static/' + (env==='dev' ? 'src/' : 'dist/'));

var config = {
    dev: {
        //应用配置
        app: {
            name: 'JC-MVC',
            port: 81,
            host: 'mvc.jc.me',//'127.0.0.1',
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
        //访问控制: 需要经过用户认证才能访问的部分目录
        access: [
           '/user',
           '/setting/user'
        ],            
        //Restful url前缀，即带此前缀的url都是restful服务，且无restful资源无关，即与model操作无关型uri前缀;
        restUriPrefix: '/api'   
    },
    //test与dev环境不一致的可以在test对象里定义，一致的不需要
    test: {},
    //production与test环境不一致的可以在production对象里定义，一致的不需要
    production:{},
    //引用配置,模块引用的header或footer或css,js的配置
    refconfig:{

    }
};

config.test = _.assign({}, config.dev, config.test);
config.production = _.assign({}, config.test, config.production);

module.exports = config[env];