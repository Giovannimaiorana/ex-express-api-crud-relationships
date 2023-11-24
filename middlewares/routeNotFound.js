// notFoundMiddleware.js
module.exports = function (req, res, next) {
    res.status(404).json({
        error: 'Questa pagina non esiste',
    });
};
