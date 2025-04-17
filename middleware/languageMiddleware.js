module.exports = (req, res, next) => {
    const lang = req.headers['accept-language'] || 'en';
    req.lang = lang;
    next();
};