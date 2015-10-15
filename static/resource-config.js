/*
 * 前端资源引用配置文件
 */

// 前端资源配置站点公用的资源放在public的模板header或footer里引用，
// 其它模块差异化的配置在这里
// 配置的值必须为数组

var RESOURCE_CONFIG = {
    // 全app公用资源引用
    common:{
        css: ["/lib/amazeui/dist/css/amazeui.css", "/css/app.css"],
        js: ["/lib/amazeui/dist/js/amazeui.js", "/lib/requirejs/require.js", "/js/app.js"]
    },
    //模块或ctrl级资源引用
    user:{
        // ctrl或模块公用
        common: {
            css: ['user.css'],
            js: ['user.js']
        },
        index: {
            css: ['user-index.css'],
            js: ['user-index.js', 'user-index2.js']
        },
        //action 如 user/edit/123
        edit:{
            css: [],
            js: []
        }
    },
    auth:{
        // ctrl或模块公用
        common: {
            css: [],
            js: []
        },
        //action 如 user/edit/123
        edit:{
            css: [],
            js: []
        }
    }
};

module.exports = RESOURCE_CONFIG;