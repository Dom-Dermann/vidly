// assumption: this is executed after the auth middleware


module.exports = function (req, res, next) {
    // 401 Unauthorized - send when token is invalid
    // 403 forbidden - send with valid token but unauthorized
    if (!req.user.isAdmin) return res.status(403).send('Access denied.');

    next();
}