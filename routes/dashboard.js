const express = require('express');
const router = express.Router();
const { protegerRuta } = require('./middleware');

router.get('/dashboard', protegerRuta, (req, res) => {
    res.render('dashboard', {
        usuario: req.session.usuario,
        tipo: req.session.tipo
    });
});

router.get('/logout', protegerRuta, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error al cerrar sesión');
        }
        //destruir la cookie de sesión
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

module.exports = router;
