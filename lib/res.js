var http = require('http');
var send = require('send');
var mime = send.mime;

var res = module.exports = {
    __proto__: http.ServerResponse.prototype
};


res.redirect = function(path) {
    // this.statusCode = 302;
    this.writeHead(302, {
        'Location': path
    });
    return this.end();
};

res.json = function json(obj) {
  var body = JSON.stringify(obj);
  this.setHeader('Content-Type', 'application/json');
  return this.end(body);
};

/**
 * Set header `field` to `val`, or pass
 * an object of header fields.
 *
 * Examples:
 *
 *    res.set('Foo', ['bar', 'baz']);
 *    res.set('Accept', 'application/json');
 *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
 *
 * Aliased as `res.header()`.
 *
 * @param {String|Object|Array} field
 * @param {String} val
 * @return {ServerResponse} for chaining
 * @api public
 */

res.set =
res.header = function header(field, val) {
  if (arguments.length === 2) {
    if (Array.isArray(val)) val = val.map(String);
    else val = String(val);
    if ('content-type' == field.toLowerCase() && !/;\s*charset\s*=/.test(val)) {
      var charset = mime.charsets.lookup(val.split(';')[0]);
      if (charset) val += '; charset=' + charset.toLowerCase();
    }
    this.setHeader(field, val);
  } else {
    for (var key in field) {
      this.set(key, field[key]);
    }
  }
  return this;
};

res.get = function(field){
  return this.getHeader(field);
};