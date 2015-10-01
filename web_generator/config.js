var path = require('path')
    ,_ = require('lodash')
    ,env = process.env.NODE_ENV || 'dev'
    ,rootPath = path.normalize(__dirname + '/app/')
    //前端目录配置，目录可以配置在环境之外，在此可以配置, 这里示例指向本机的文件夹webcenter
    ,fePath = path.normalize('{{appFePath}}');

var config = {
    dev: {
        //应用配置
        app: {
            name: '{{appName}}',
            port: '{{appPort}}',
            host: '{{appHost}}',//'127.0.0.1',
        },
        //目录配置
        path: {
            fe: fePath,
            root: rootPath,     //根目录
            stat: path.normalize(fePath + (env==='dev' ? 'src/' : 'dist/')),   //静态资源目录
            view: path.normalize(fePath + 'views/')     //模板目录
        },           
        //Restful url前缀，即带此前缀的url都是restful服务，且无restful资源无关，即与model操作无关型uri前缀;
        // restUriPrefix: '/api'   
    },
    //test重载dev, test与dev环境不一致的可以在test对象里定义，一致的不需要
    test: {},
    //生产版环境配置：production重载dev与test,production与test环境不一致的可以在production对象里定义，一致的不需要
    production:{},
    //引用配置,模块引用的header或footer或css,js的配置
    refconfig:{}
};
config.test = _.assign({}, config.dev, config.test);
config.production = _.assign({}, config.test, config.production);

module.exports = config[env];