const { Pool } = require("pg");

const conexion = new Pool({

    user: process.env.DB_USUARIO,
    host: process.env.DB_HOST,
    database: process.env.DB_NOMBRE,
    password: String(process.env.DB_PASSWORD),
    port: Number(process.env.DB_PUERTO)

});

conexion.query("SELECT NOW()", (error, resultado) => {

    if (error) {
        console.log("Error de conexión:", error);
    } else {
        console.log("Conexión exitosa a PostgreSQL");
    }

});

module.exports = conexion;