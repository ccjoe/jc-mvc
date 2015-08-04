#jc-mvc
=======

[jc-mvc](https://github.com/ccjoe/jc-mvc)
_仅具基本模型，尚在完善中......_

## 依赖：
- DB驱动     "mongoskin"
- 模板引擎    "dot"

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
//传入配置
jc.server(config);
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
    view : function (req, res, next) {
        collection.findOne({name: req.name}, next);
    }
};
//将导出的方法promise化
module.exports = Jc.promisifyModel(userSets);

```

### 定义控制器及ACTION
控制器利用model返回的promise将取得的数据返回，控制器会返回一个带数据的promise方法，框架会将控制器返回的数据自动处理,
控制器仅需返回一个_带数据的promise方法_。
```javascript
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