const express = require('express');
const router = express.Router();
const conexion = require('../database/conexion');
const { protegerRuta } = require('./middleware');

router.get('/dashboard', protegerRuta, (req, res) => {
    res.render('dashboard', {
        nombre: req.session.nombre,
        correo: req.session.correo
    });
});

//ruta para el buzon de sugerencias, que es una pagina protegida
router.get('/buzon', protegerRuta, (req, res) => {

    res.render('buzon', {
        titulo: 'Buzón',
        nombre: req.session.nombre
    });

});

//ruta para enviar mensajes al buzon de sugerencias, que es una pagina protegida
router.post('/buzon', protegerRuta, async (req, res) => {

    const nombre = req.body.nombre;
    const asunto = req.body.asunto;
    const mensaje = req.body.mensaje;

    try {

        await conexion.query(

            `INSERT INTO buzon
            (nombre, asunto, mensaje)
            VALUES ($1, $2, $3)`,

            [nombre, asunto, mensaje]

        );

        res.send('Mensaje enviado correctamente');

    } catch (error) {

        console.log(error);

        res.status(500).send(
            'Error al enviar mensaje'
        );

    }

});

//ruta para el chat, que es una pagina protegida
router.get('/chat', protegerRuta, async (req, res) => {

    try {

        const mensajes = await conexion.query(
            `SELECT * FROM chat
             ORDER BY fecha ASC`
        );

        res.render('chat', {
            titulo: 'Chat',
            nombre: req.session.nombre,
            mensajes: mensajes.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).send(
            'Error al cargar el chat'
        );

    }

});

//ruta para enviar mensajes al chat, que es una pagina protegida
router.post('/chat', protegerRuta, async (req, res) => {

    const mensaje = req.body.mensaje;

    try {

        await conexion.query(

            `INSERT INTO chat
            (usuario, mensaje, fecha)
            VALUES ($1, $2, NOW())`,

            [req.session.nombre, mensaje]

        );

        res.redirect('/chat');

    } catch (error) {

        console.log(error);

        res.status(500).send(
            'Error al enviar mensaje'
        );

    }

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
