//routes/auth.js
const express = require('express');
const router = express.Router();
const conexion = require('../database/conexion');
const bcrypt = require('bcrypt');
const axios = require('axios');
//const { protegerRuta } = require('./middleware');

router.get('/', (req, res) => {
    res.render('index');
});

//aqui se hace el login del usuario, se compara la contraseña ingresada con la contraseña encriptada en la base de datos usando bcrypt.compare
router.post('/login', async (req, res) => {
const correo = req.body.correo;
const password = req.body.password;

    try {
        const resultado = await conexion.query(
            `SELECT * FROM usuarios WHERE correo = $1`,
            [correo]
        );

        if (resultado.rows.length === 0) {
            return res.send('Usuario no encontrado');
        }

        const usuario = resultado.rows[0];
        const acceso = await bcrypt.compare(password,usuario.password);

        if (acceso) {
            req.session.usuario = usuario.correo;
            req.session.nombre = usuario.nombre;
            req.session.correo = usuario.correo;
            res.redirect('/dashboard');
        } else {
            res.send('Contraseña incorrecta');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el login');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});


router.get('/registro', (req, res) => {
    res.render('registro', {
        siteKey: process.env.RECAPTCHA_SITE_KEY
    });
});

//en esta parte se hace el registro del usuario, se encripta la contraseña con bcrypt y se guarda en la base de datos
router.post('/registro', async (req, res) => {
    const nombre = req.body.nombre;
    const correo = req.body.correo;
    const password = req.body.password;

    // Verificar captcha
    const captcha= req.body['g-recaptcha-response'];
    if (!captcha) {
        return res.status(400).send('Por favor, completa el captcha');
    }

// Verificar la respuesta del captcha con Google
    const verificarCaptcha = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`, 
        null, 
        {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: captcha
            }
        }
    );
    if (!verificarCaptcha.data.success) {
        return res.status(400).send('Captcha inválido');
    }

    //cifrar la contraseña con bcrypt antes de guardarla en la BD
    try {
        const hash = await bcrypt.hash(password, 10);

        console.log('Correo:', correo);
        console.log('Hash bcrypt:', hash);

        await conexion.query(
            `INSERT INTO usuarios (nombre, correo, password) VALUES ($1, $2, $3)`,
            [nombre, correo, hash]
        );

        res.redirect('/login');
    } catch (error) {
        console.log(error);
        if (error && error.code === '23505') {
            return res.status(400).send('El correo ya está registrado');
        }
        res.status(500).send('Error en el registro');
    }
});



module.exports = router;
