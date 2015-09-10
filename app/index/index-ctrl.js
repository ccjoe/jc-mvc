exports.index = function (req, res) {
    return {
        passport: req.session.passport
    }
}
