//消息体定义
/*
code : 200,
msg: 'MESSAGE CONTENT'
*/

function pageMessage(opts) {
    this.code = opts.code || '200';
    this.msg  = opts.msg || 'success';
    this.title = this.title ||　'Jc mvc';
    this.data = opts.data;
}

function jsonMessage(opts){
    this.code = opts.code || '200';
    this.msg  = opts.msg || 'success';
    this.data = opts.data;
}

exports = module.exports = {
    pageMessage: pageMessage,
    jsonMessage: jsonMessage
};