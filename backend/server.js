const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Carga las variables de entorno del archivo .env
const db = require("./config/db"); // Importa la conexión a la base de datos
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoute");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares obligatorios
app.use(cors());
app.use(express.json()); // Permite que Express entienda los cuerpos JSON (req.body)

app.use("/api/auth", authRoutes); // Endpoints públicos (login/register)
app.use("/api/tasks", taskRoutes);

// Ruta de prueba inicial para verificar que el servidor responda
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "El servidor de Node.js está corriendo..." });
});

// Arrancamos el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
