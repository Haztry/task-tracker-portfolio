const db = require("../config/db");

const User = {
  // Crear un nuevo usuario
  create: async (username, email, hashedPassword) => {
    const queryText = `
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, username, email, created_at;
        `;
    const { rows } = await db.query(queryText, [username, email, hashedPassword]);
    return rows[0];
  },

  // Buscar un usuario por email (para el login)
  findByEmail: async (email) => {
    const qry = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await db.query(qry, [email]);
    return rows[0];
  },
};

module.exports = User;
