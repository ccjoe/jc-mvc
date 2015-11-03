/*
 * 前端资源引用配置文件
 */

// 前端资源配置站点公用的资源放在public的模板header或footer里引用，
// 其它模块差异化的配置在这里
// 配置的值必须为数组

var RESOURCE_CONFIG = {
    // 全app公用资源引用
    common:{
        css: ["/static/lib/amazeui/dist/css/amazeui.css", "/static/css/app.css"],
        js: ["/static/lib/amazeui/dist/js/amazeui.js", "/static/lib/requirejs/require.js", "/static/js/app.js"]
    },
    //模块或ctrl级资源引用
    user:{
        // ctrl或模块公用
        common: {
            css: ['/static/css/user.css'],
            js: ['/static/js/user2.js']
        },
        index: {
            css: ['/static/css/user-index.css'],
            js: ['/static/js/user-index.js', '/static/js/user-index2.js']
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