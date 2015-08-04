var path = require('path'),
    rootPath = path.normalize(__dirname + '/app'),
    env = process.env.NODE_ENV || 'dev';
    console.log(rootPath, 'rootPath');
var config = {
    dev: {
        app: {
            name: 'JC-MVC', 
            port: 1337,
            host: '127.0.0.1',
            root: rootPath
        },
        db: {
            host: '127.0.0.1',
            port: '27017'
        },
        access: [
           '/user/',
           '/setting/user'
        ]
    },
    test: {
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