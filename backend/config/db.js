const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  ssl: require, // <-- Esto fuerza el SSL directo en el código si es necesario
});

// Probamos la conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error al conectar a PostgreSQL: ", err.message);
  } else {
    console.log("Base de datos conectada con éxito.");
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
