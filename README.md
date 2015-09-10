#jc-mvc
=======

引入依赖jcmvc  `npm install jcmvc`
jcmvc的example实例

[jc-mvc](https://github.com/ccjoe/jc-mvc)

_仅具基本模型，尚在完善中......_

## 个人觉得有以下特点或优点：

- 采取自然映射，无需配置路由及手动路由，模块或目录结构的组织即路由。 
  1. mvc  ---> ctrl/action/param
  2. rest ---> restUriPrefix/resource/param [GET, POST, PUT, DELETE]
- 无需处理除数据外的其它动作。
  1. model自动promise化
  2. mvc自动渲染页面，rest自动渲染json,仅需要在ctrl里组织装好数据，ctrl自动处理与model及view/json的联结。
- mvc与rest轻松结合, Ctrl/Action 与 Resource/Method约定相结合。
- 与express相同的中间件处理方式


## 依赖：
- DB驱动     "mongoskin"
- 模板引擎    "dot"
- 中间件     "connect"

## 简介：

一个基于自然映射的MVC Nodejs框架，通过约定的URL与约定的控制器，行为，及视图的目录结构来构成系统。
比如访问 `http://localhost:1337/user/view/123`将会调用 user控制器的view动作并传参ID的渲染user-view视图...

## 使用：

### 创建server
将简单的配置文件导出对象传入 jc.server方法即可：
```javascript
//app.js
var config = require('./config');
var jc = require('./jc');

var app = jc.app();
//......
//app.use(中间件)
//app.use(中间件)
//app.use(中间件)
//启动服务

jc.server(app);
```

### 定义模型
定义模型前首先需要取得对数据驱动的引用，如同创建server样创建
```javascript
var config = require('../../config');
var Jc = require('../../jc');
//传入配置及db name
var db = Jc.db(config, 'blog');
```

获取db的引用后定义模型就相当简单了，如下user模块的列表（list）和详情(view);
需要注意的间导出user model时需要将导出的方法promise化, `module.exports = Jc.promisifyModel(userSets);`,框架利用原生ES6 Promise对其进行自动处理。
```javascript 
//model user.js
var collection = db.collection('user');

var userSets = {
    list : function (req, res, next) {
        collection.find({}).toArray(next);
    },
    update: function(){},
    create: function(){},
    remove: function(){}
};
//将导出的方法promise化
module.exports = Jc.promisifyModel(userSets);

```

### 定义控制器及ACTION
控制器利用model返回的promise将取得的数据返回，控制器会返回一个带数据的promise方法，框架会将控制器返回的数据自动处理,
控制器仅需返回一个_带数据的promise方法_。
```javascript
//定义MVC的数据输出
var userModel = require('../models/user');

exports.index = function(req, res){
    return {};
}

exports.list = function (req, res, args) {
    return userModel.list(req, res).then(function(list){
        return list;
    });
}

exports.view = function (req, res, args) {
    req.name = args;
    return userModel.view(req, res).then(function(data){
        return data;
    });
}
//定义REST的数据输出
exports.rest = {
    query: exports.list,
    update: function(req, res){
        return userModel.update(req, res).then(function(res){
            return res;
        });
    },
    create: function(req, res){
        return userModel.create(req, res).then(function(res){
            return res;
        });
    },
    remove: function(req, res){
        return userModel.remove(req, res).then(function(res){
            return res;
        });
    }
}
```

### 定义视图
框架将控制器的视图自动传入模板，这里模板引擎固定为doT。doT在测试中执行效率较高，且语法较为简单实用。
```html
{{#def.load('public/header.html')}}
<p>用户 {{=it.name }}：</p>
<pre>
是否管理员： {{=it.admin}}
用户密码： {{=it.password }}
用户邮箱：{{=it.email }}
</pre>
{{#def.load('public/footer.html')}}

```

### 约定的目录结构
按上面的步骤，MVC的user模块就实现了。如前所述，访问 `http://localhost:1337/user/view/123`将会调用 user控制器的view动作并传参ID的渲染user-view视图...，所以目录结构需要按模块进行，这也是目前较好的目录结构方式。

```
├── app
│   ├── ctrls
│   │   ├── index.js
│   │   └── user.js
│   ├── models
│   │   └── user.js
│   └── views
│       ├── index
│       │   └── index.html
│       ├── public
│       │   ├── error.html
│       │   ├── footer.html
│       │   └── header.html
│       └── user
│           ├── list.html
│           └── view.html


```

_待完善：_ 对cookies, session, auth, cache等相关处理。 

### 更新日志:
- 2015-07-26 引入connect模块, 方便使用中间件。
- 2015-08-03 加入passport与passport-local模块，用户登录认证。
- 2015-08-04 更新日志 引入Restful模块，在config里配置restRuiPrefix: '/api',则此路由下服从restful规则。
- 2015-08-05 基本完成rest模块。rest的model可以共用mvc的model，也可以在model里定义个rest对象方法集合，在ctrl里对应的也是exports.rest = {},规则与MVC一样，ctrl仅需要返回组织好的数据，如果是promise则需要返回带组织好的数据的promise便可以自动返回json
