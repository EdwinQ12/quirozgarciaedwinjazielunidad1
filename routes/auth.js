const express = require('express');
const router = express.Router();
const conexion = require('../database/conexion');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { protegerRuta } = require('./middleware');

router.get('/', (req, res) => {
    res.render('inicio');
});

router.get('/login-inseguro', (req, res) => {
    res.render('login-inseguro');
});

router.post('/login-seguro', async (req, res) => {
    const correo = req.body.correo;
    const contraseña = req.body.contraseña;

    try {
        const resultado = await conexion.query(
            `SELECT * FROM usuarios_seguros WHERE correo = $1`,
            [correo]
        );

        if (resultado.rows.length === 0) {
            return res.send('Usuario no encontrado');
        }

        const usuario = resultado.rows[0];
        const acceso = await bcrypt.compare(contraseña, usuario.contraseña);

        if (acceso) {
            req.session.usuario = usuario.correo;
            req.session.tipo = 'Seguro Bcrypt';
            res.redirect('/dashboard');
        } else {
            res.send('Contraseña incorrecta');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el login');
    }
});

router.get('/login-seguro', (req, res) => {
    res.render('login-seguro');
});

router.get('/registro-inseguro', (req, res) => {
    res.render('registro-inseguro');
});

router.get('/registro-seguro', (req, res) => {
    res.render('registro-seguro');
});

router.post('/login-inseguro', async (req, res) => {
    const correo = req.body.correo;
    const contraseña = req.body.contraseña;

    const hash = crypto.createHash('sha256').update(contraseña).digest('hex');

    try {
        const resultado = await conexion.query(
            `SELECT * FROM usuarios_inseguros WHERE correo = $1`,
            [correo]
        );

        if (resultado.rows.length === 0) {
            return res.send('Usuario no encontrado');
        }

        const usuario = resultado.rows[0];

        if (usuario.contraseña === hash) {
            req.session.usuario = usuario.correo;
            req.session.tipo = 'Inseguro SHA256';
            res.redirect('/dashboard');
        } else {
            res.send('Contraseña incorrecta');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el login');
    }
});

router.post('/registro-inseguro', async (req, res) => {
    const correo = req.body.correo;
    const contraseña = req.body.contraseña;

    const hash = crypto.createHash('sha256').update(contraseña).digest('hex');

    console.log('Correo:', correo);
    console.log('Hash SHA256:', hash);

    try {
        await conexion.query(
            `INSERT INTO usuarios_inseguros (correo, contraseña) VALUES ($1, $2)`,
            [correo, hash]
        );

        res.redirect('/login-inseguro');
    } catch (error) {
        console.log(error);
        if (error && error.code === '23505') {
            return res.status(400).send('El correo ya está registrado');
        }
        res.status(500).send('Error en el registro');
    }
});

router.post('/registro-seguro', async (req, res) => {
    const correo = req.body.correo;
    const contraseña = req.body.contraseña;

    try {
        const hash = await bcrypt.hash(contraseña, 10);

        console.log('Correo:', correo);
        console.log('Hash bcrypt:', hash);

        await conexion.query(
            `INSERT INTO usuarios_seguros (correo, contraseña) VALUES ($1, $2)`,
            [correo, hash]
        );

        res.redirect('/login-seguro');
    } catch (error) {
        console.log(error);
        if (error && error.code === '23505') {
            return res.status(400).send('El correo ya está registrado');
        }
        res.status(500).send('Error en el registro');
    }
});



module.exports = router;
