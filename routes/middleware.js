//middleware para proteger rutas
function protegerRuta(req, res, next) {

    if (!req.session || !req.session.usuario) {

        req.session.mensaje = {
            tipo: 'warning',
            texto: 'Debes iniciar sesión para acceder'
        };

        return res.redirect('/login');
    }

    next();
}

module.exports = { protegerRuta };