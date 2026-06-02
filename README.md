# Sistema de Comparación de Autenticación Segura e Insegura

## Descripción

Este proyecto consiste en el desarrollo de una aplicación web utilizando Node.js, Express, PostgreSQL y EJS para comparar dos métodos de autenticación de usuarios:

* **Login inseguro:** utiliza SHA256 sin salt.
* **Login seguro:** utiliza bcrypt con salt automático.

El propósito principal es comprender la importancia del almacenamiento seguro de contraseñas y demostrar las diferencias entre un sistema vulnerable y uno protegido mediante buenas prácticas de ciberseguridad.

---

# Objetivos

## Objetivo General

Desarrollar una aplicación web que permita comparar dos métodos de autenticación y almacenamiento de contraseñas para comprender la importancia de la seguridad en el desarrollo de software.

## Objetivos Específicos

* Implementar un sistema de registro de usuarios.
* Implementar un sistema de inicio de sesión.
* Almacenar usuarios en PostgreSQL.
* Comparar el uso de SHA256 y bcrypt.
* Implementar sesiones de usuario.
* Proteger rutas privadas.
* Implementar cierre de sesión.
* Mostrar visualmente las diferencias entre ambos métodos.

---

# Tecnologías Utilizadas

## Backend

* Node.js
* Express

## Base de Datos

* PostgreSQL
* pgAdmin 4

## Frontend

* EJS
* Bootstrap 5

## Seguridad

* bcrypt
* crypto (SHA256)
* express-session
* dotenv

---

# Dependencias Instaladas

```bash
npm install express
npm install ejs
npm install pg
npm install express-session
npm install dotenv
npm install bcrypt
```

---

# Estructura del Proyecto

```text
proyecto-login/
│
├── database/
│   └── conexion.js
│
├── views/
│   ├── index.ejs
│   ├── registro-inseguro.ejs
│   ├── login-inseguro.ejs
│   ├── registro-seguro.ejs
│   ├── login-seguro.ejs
│   ├── dashboard.ejs
│   └── comparar.ejs
│
├── .env
├── app.js
├── package.json
└── node_modules/
```

---

# Configuración de Base de Datos

## Base de Datos

```sql
CREATE DATABASE login_seguro;
```

---

## Tabla Usuarios Inseguros

```sql
CREATE TABLE usuarios_inseguros (

    id SERIAL PRIMARY KEY,

    correo VARCHAR(100) UNIQUE NOT NULL,

    contraseña TEXT NOT NULL

);
```

---

## Tabla Usuarios Seguros

```sql
CREATE TABLE usuarios_seguros (

    id SERIAL PRIMARY KEY,

    correo VARCHAR(100) UNIQUE NOT NULL,

    contraseña TEXT NOT NULL

);
```

---

# Variables de Entorno

Archivo:

```text
.env
```

Contenido:

```env
DB_USUARIO=postgres
DB_HOST=localhost
DB_NOMBRE=login_seguro
DB_PASSWORD=admin
DB_PUERTO=5432

SESSION_SECRET=proyecto_login_seguro
```

---

# Importante

Durante el desarrollo se presentó un problema de conexión debido al orden de carga de las dependencias.

La línea:

```javascript
require("dotenv").config();
```

debe ejecutarse antes de importar cualquier archivo que utilice variables de entorno.

Correcto:

```javascript
require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const conexion = require("./database/conexion");
```

---

# Sistema de Registro Inseguro

Utiliza SHA256 para generar un hash de la contraseña.

Proceso:

```text
Contraseña
    ↓
SHA256
    ↓
Hash
    ↓
Base de Datos
```

Características:

* No utiliza salt.
* Una misma contraseña genera siempre el mismo hash.
* Vulnerable a ataques de diccionario.
* Vulnerable a rainbow tables.

Ejemplo:

```text
12345
↓
5994471abb01112af...
```

---

# Sistema de Registro Seguro

Utiliza bcrypt con salt automático.

Proceso:

```text
Contraseña
    ↓
Salt Automático
    ↓
bcrypt
    ↓
Hash
    ↓
Base de Datos
```

Características:

* Salt automático.
* Hash único por usuario.
* Protección contra rainbow tables.
* Recomendado para aplicaciones reales.

Ejemplo:

```text
12345
↓
$2b$10$Xj2...
```

---

# Sistema de Login

## Login Inseguro

1. El usuario ingresa correo y contraseña.
2. Se genera nuevamente el hash SHA256.
3. Se compara con el hash almacenado.
4. Si coinciden, se inicia sesión.

---

## Login Seguro

1. El usuario ingresa correo y contraseña.
2. Se recupera el hash almacenado.
3. bcrypt.compare() realiza la validación.
4. Si coinciden, se inicia sesión.

---

# Sesiones

Se utiliza:

```javascript
express-session
```

para mantener la autenticación del usuario.

Información almacenada:

```javascript
req.session.usuario
req.session.tipo
```

---

# Protección de Rutas

Se implementó un middleware personalizado:

```javascript
function protegerRuta(req, res, next) {

    if (!req.session.usuario) {

        return res.redirect("/");

    }

    next();

}
```

Funciones:

* Impide acceso sin autenticación.
* Protege Dashboard.
* Protege Comparación de Resultados.

---

# Dashboard

Características:

* Muestra correo del usuario.
* Muestra tipo de autenticación utilizada.
* Permite acceder a la comparación.
* Permite cerrar sesión.

---

# Comparación de Resultados

La aplicación incluye una sección donde se explica visualmente la diferencia entre SHA256 y bcrypt.

| Característica            | SHA256 | bcrypt |
| ------------------------- | ------ | ------ |
| Hash fijo                 | Sí     | No     |
| Salt automático           | No     | Sí     |
| Seguro para contraseñas   | No     | Sí     |
| Protección Rainbow Tables | No     | Sí     |
| Uso recomendado           | No     | Sí     |

---

# Logout

Se implementó cierre de sesión mediante:

```javascript
req.session.destroy()
```

Función:

* Elimina la sesión activa.
* Redirige al usuario al inicio.

---

# Resultados Obtenidos

Se logró desarrollar una aplicación web funcional capaz de:

* Registrar usuarios.
* Iniciar sesión.
* Conectar Node.js con PostgreSQL.
* Comparar SHA256 y bcrypt.
* Gestionar sesiones.
* Proteger rutas privadas.
* Implementar logout.
* Visualizar diferencias de seguridad.

Además, se comprobó que:

* SHA256 genera siempre el mismo hash para la misma contraseña.
* bcrypt genera hashes distintos gracias al uso de salt automático.
* bcrypt ofrece una protección significativamente superior para el almacenamiento de contraseñas.

---

# Conclusión

El desarrollo de esta aplicación permitió comprender la importancia de implementar mecanismos de autenticación seguros en aplicaciones web. La comparación entre SHA256 y bcrypt evidenció que el uso de salt automático incrementa considerablemente la seguridad de las contraseñas almacenadas, reduciendo el riesgo de ataques por diccionario y rainbow tables. Asimismo, se reforzaron conocimientos sobre sesiones, bases de datos, middleware y buenas prácticas de desarrollo seguro.
