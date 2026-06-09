const express = require('express');
const router = express.Router();
const conexion = require('../database/conexion');

// rutas publicas
router.get('/nosotros', (req, res) => {
    res.render('nosotros', {
        titulo: 'Nosotros'
    });
});

router.get('/servicios', (req, res) => {
    res.render('servicios', {
        titulo: 'Servicios'
    });
});

router.get('/especialistas', (req, res) => {
    res.render('especialistas', {
        titulo: 'Especialistas'
    });
});

router.get('/contacto', (req, res) => {
    res.render('contacto', {
        titulo: 'Contacto'
    });
});

router.get('/ayuda', (req, res) => {
    res.render('ayuda', {
        titulo: 'Ayuda'
    });
});

router.get('/mapa-sitio', (req, res) => {
    res.render('mapa-sitio', {
        titulo: 'Mapa del Sitio'
    });
});

router.get('/recuperar', (req, res) => {
    res.render('recuperar', {
        titulo: 'Recuperar Contraseña'
    });
});

//busqueda de paginas por query
router.get('/buscar', (req, res) => {

    const busqueda = req.query.q.toLowerCase();

    const paginas = {

        inicio: '/',
        nosotros: '/nosotros',
        servicios: '/servicios',
        especialistas: '/especialistas',
        contacto: '/contacto',
        ayuda: '/ayuda',
        registro: '/registro',
        login: '/login',
        recuperar: '/recuperar',
        mapa: '/mapa-sitio',

    };

    if (paginas[busqueda]) {

        return res.redirect(paginas[busqueda]);

    }

    res.status(404).render('404', {
        titulo: 'Resultado no encontrado'
    });

});

//ruta para el buzon de sugerencias, que es una pagina publica
router.get('/buzon', (req, res) => {
    res.render('buzon', {
        titulo: 'Buzón'
    });
});

router.post('/buzon', async (req, res) => {

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

module.exports = router;