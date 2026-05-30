//middleware para proteger rutas
function protegerRuta(req, res, next) {
    if (!req.session || !req.session.usuario) {
        return res.redirect("/");
    }
    next();
}

module.exports = { protegerRuta };
    