/*
 * 环境配置文件
 */

var path = require('path')
    ,_ = require('lodash')
    //环境判断，默认为dev版
    ,env = process.env.NODE_ENV || 'dev'
    //根目录配置
    ,rootPath = path.normalize(__dirname + '/app/')
    //前端目录配置，目录可以配置在环境之外，在此可以配置, 这里示例指向本机的文件夹webcenter
    ,fePath = path.normalize(__dirname + '/resource/');

var ENV_CONFIG = {
    dev: {
        env: 'dev',
        //应用配置
        app: {
            name: 'JC-MVC',
            port: 81,
            host: 'mvc.jc.me',//'127.0.0.1',
        },
        //目录配置
        path: {
            fe: fePath,
            root: rootPath,     //根目录
            stat: path.normalize(fePath + (env==='dev' ? 'static/' : 'dist/')),   //静态资源目录
            view: path.normalize(fePath + 'views/'),     //模板目录
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
    //test重载dev, test与dev环境不一致的可以在test对象里定义，一致的不需要
    test: {
        env: 'test',
    },
    //生产版环境配置：production重载dev与test,production与test环境不一致的可以在production对象里定义，一致的不需要
    production:{
        env: 'production',
    },
    //引用配置,模块引用的header或footer或css,js的配置
    refconfig:{

    }
};
ENV_CONFIG.test = _.assign({}, ENV_CONFIG.dev, ENV_CONFIG.test);
ENV_CONFIG.production = _.assign({}, ENV_CONFIG.test, ENV_CONFIG.production);

module.exports = ENV_CONFIG[env];
