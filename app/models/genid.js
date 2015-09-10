var jc = jc = require('jcmvc');
var db = jc.db('blog');
var co = db.collection('counts');

var genid = {
    init: function() {
        console.log('genid.init has run');
        co.insert({
            _id: "userid",
            seq: 0
        });
    },
    //记录 id的增长并且返回增长后的值
    getNextSequence: function(name) {
        var ret = co.findAndModify({
            _id: name
        }, [], { $inc: {
                seq: 1 }
        }, {
            new: true
        });
        return ret.seq;
    }
}
genid.init();
exports = module.exports = genid.getNextSequence;
