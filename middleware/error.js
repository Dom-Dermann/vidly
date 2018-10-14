module.exports = function(err, req, res, next) {
    // TODO: log the exception
    res.status(500).send('Something failed');
}