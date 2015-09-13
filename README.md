# jcmvc
=======
__一个Nodejs MVC jcmvc的使用示例框架，jcmvc可以用来开发基于Nodejs的MVC模式的Web应用 或者 作为前端的前端模块化组织的web服务器__


引入依赖`jcmvc`:  `npm install jcmvc`  
jcmvc的npm地址：https://www.npmjs.com/package/jcmvc  
jcmvc的example的使用实例: [jc-mvc](https://github.com/ccjoe/jc-mvc)

## 使用方法：

 - 下载代码： 假设到如下目录 /Users/shaofengliu/IT/git/jc-mvc
 ```shell
git clone git@github.com:ccjoe/jc-mvc.git
 ```
 
 <!-- more -->

 - 安装依赖  `cd jc-mvc` `npm install`
 
 __这项目主要有二大功能用途：__

 1. 基于Nodejs开发MVC的web应用，说明详见：[npm build](https://www.npmjs.com/package/jcmvc)或[jcmvc Git](https://github.com/ccjoe/jcmvc)
 2. 适合于前端开发的一个环境：作为前端模块化组织的web服务器,特点是可以多支持任意目录的多web应用服务。  
```
//
.
├── README.md   
├── app             //业务逻辑代码，规范是按业务逻辑划分的model与ctrl, 
├── static          //前端静态代码，也是提供多web服务时的`主应用`的前端目录。
├── web_generator   //创建新的web应用时根据这里的模板生成web应用的配置与入口。
├── webs            //创建新的web应用生成的多web的入口与配置文件，即除`主应用`之外的其它web应用都在此目录
├── app.js          //`主应用`入口文件
├── config.js       //`主应用`配置文件，注意其它应用的入口与配置文件在webs里
├── bower.json      //`主应用`前端依赖
├── package.json    //`主应用`服务依赖与构建依赖
├── gulpfile.js     // 多应用构建中心，可由此启动多应用 `gulp webName`即会启动相应的webapp
├── gulpfile.backup
├── bower_components// 前端依赖包
└── node_modules    // 服务依赖与构建依赖赖包
```
 
 
## 配置多Web服务 

如果本机仅管理一个web应用，当然不需要创建新的web服务，在主应用(jc-mvc)里app和static目录即可管理与开发，如果又需要一个新的web服务，难道再复制一个jc-mvc吗，No! 不需要，仅需要在webs目录里新建复制相应的配置文件和主文件，如果这太麻烦，这里提供命令交互实现，你需要:  

1. `gulp create` 命令行交互会提示输入，然后创建一个web服务，如下
```shell
? 请输入webApp的名称: youWebName
? 请输入app的域名: 127.0.0.1
? 请输入端口: 3300
? 请输入webApp的前端路径: /Users/shaofengliu/IT/git/webcenter/youWebName/
恭喜，已创建完毕，可运行 gulp youWebName运行！
```

2. 这样就会生成一个新的web环境，依此可以新建多个web服务。
注意，请输入webApp的前端路径可以为任意指定的目录（可以在jc-mvc目录之内或外）。

3. `gulp update`, 新建一个web app挂载到jc-mvc下后，要使用`gulp update`更新注册gulp task任务，以便下一步启动。 

4. `gulp youWebName` 最后 gulp youWebName，即可启动相应的web，可同时多开。

## 有什么好处?  

1. 一台机器仅需要一个宿主环境即可管理多web，即jc-mvc
    这有点类似 apache或iis配置多网站，但这里不仅如此还提供了额外的功能
2. 所有的web应用拥有最简单的自然映射的MVC
3. 打包了doT这个模板引擎去模块化页面
4. 打包了nodemon与livereload的监控机制，所有应用可实现自动重启与页面刷新

作为适合于前端开发的一个环境，一般多web（除主web外）不需要处理ctrl与model（如果需要的话，可以在youWebName里新建app目录同样可以实现由nodejs渲染带数据的页面）,前端目录结构如下：
```
//前端目录，可以实现任意多个任意路径的web挂载在jc-mvc下实现多web服务
// /Users/shaofengliu/IT/git/webcenter/youWebName/
.
├── app         //仅作为前端环境不需要，但是也可以在里面按业务逻辑去写model与ctrl,由ctrl返回数据结构给页面。
├── dist        //构建后的dist目录
│   ├── css
│   ├── fonts
│   └── js
├── src         //前端静态资源目录
│   ├── css
│   ├── favicon.ico
│   ├── img
│   ├── js
│   └── sass          
└── views       //前端模板目录，决定路由
    ├── auth
    │   └── login.html
    ├── index
    │   └── index.html
    ├── module
    │   └── test.html
    ├── public
    │   ├── error.html
    │   ├── footer.html
    │   └── header.html
    └── user
        ├── add.html
        ├── edit.html
        ├── index.html
        ├── layout.html
        ├── list.html
        ├── partial
        └── view.html
```

根据views生成的路由规则，及之前命令行交互的配置，那么访问views里的user的list即是  
`127.0.0.1:3300/user/list`，  
而且这些模板文件很方便的模块化及相互引用（可查看示例代码），再也不需要多次复制相同的结构与代码。对于重构与页面开发的是一个很好的环境，对于交付给下游也是高质量的输出，因为不管是前端渲染页面还是后端，实现后都应该是类似这样的结构。


## 更新日志:
- 2015-07-26 引入connect模块, 方便使用中间件。
- 2015-08-03 加入passport与passport-local模块，用户登录认证。
- 2015-08-04 更新日志 引入Restful模块，在config里配置restRuiPrefix: '/api',则此路由下服从restful规则。
- 2015-08-05 基本完成rest模块。rest的model可以共用mvc的model，也可以在model里定义个rest对象方法集合，在ctrl里对应的也是exports.rest = {},规则与MVC一样，ctrl仅需要返回组织好的数据，如果是promise则需要返回带组织好的数据的promise便可以自动返回json
- 2015-09-11 
    将jcmvc npm化  
    提供多web服务，可以指定到任意目录（详见以上）  

