require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const conexion = require("./database/conexion");

const app = express();

//el middleware esta exportado en `routes/middleware.js`.

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const PUERTO = 3000;
//importar crypto para hashing de contraseñas
const crypto = require("crypto");
//importar bcrypt para hashing de contraseñas seguras
const bcrypt = require("bcrypt");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);


app.use('/', authRoutes);
app.use('/', dashboardRoutes);

app.listen(PUERTO, () => {
    console.log(`Servidor funcionando en http://localhost:${PUERTO}`);
});      