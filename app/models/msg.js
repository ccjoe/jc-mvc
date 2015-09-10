//消息体定义
/*
code : 200,
msg: 'MESSAGE CONTENT',
data: obj || array
*/

function pageMessage(opts) {
    this.code = opts.code || '200';
    this.msg  = opts.msg || 'success';
    this.title = this.title ||　'Jc mvc';
    this.path = opts.path || '';
    this.data = opts.data;
}

function jsonMessage(opts){
    this.code = opts.code || '200';
    this.msg  = opts.msg || 'success';
    this.data = opts.data;
}

var msg = {
    pageMessage: pageMessage,
    jsonMessage: jsonMessage
};

//opts.type  json|page
function setMsg(opts){
    opts.type = opts.type || 'json';
    return new msg[opts.type+'Message'](opts);
}

exports = module.exports = setMsg