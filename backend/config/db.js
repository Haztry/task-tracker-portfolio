const { Pool } = require("pg");
require("dotenv").config(); // Esto carga las variables del archivo .env

// Configuramos el grupo de conexiones (Pool) usando las variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// Probamos la conexión intentando conectar un cliente del pool
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error al conectar a PostgreSQL: ", err.message);
  } else {
    console.log("Base de datos conectada con éxito.");
    release(); // Devolvemos el cliente al pool de inmediato
  }
});

// Exportamos la función query para que nuestros Modelos puedan usarla
module.exports = {
  query: (text, params) => pool.query(text, params),
};
