const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = {
  // 1. REGISTRO DE USUARIOS
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ ok: false, error: { message: "Todos los campos son obligatorios." } });
      }

      // Encriptar la contraseña (Good practice obligatoria)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Guardar en la base de datos
      const newUser = await User.create(username, email, hashedPassword);

      res.status(201).json({
        ok: true,
        data: { message: "Usuario registrdao con éxito", user: newUser },
      });
    } catch (error) {
      res.status(400).json({
        ok: false,
        error: {
          code: "AUTH_ERROR",
          message: error.message.includes("unique") ? "El correo o usuario ya existe." : error.message,
        },
      });
    }
  },

  // 2. INICIO DE SESIÓN (Generación de JWT)
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Buscar si el usuario existe
      const user = await User.findByEmail(email);
      if (!user) {
        return res
          .status(401)
          .json({ ok: false, error: { message: "Credenciales incorrectas (Email no encontrado)." } });
      }

      // Verificar la contraseña con bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ ok: false, error: { message: "Credenciales incorrectas (Contraseña inválida)." } });
      }

      // Firmar el JWT (Contiene el Payload sin datos sensibles, solo id y email)
      // Es STATELESS porque el servidor no guarda sesiones en memoria, el token lo lleva todo.
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }, // El token expira automáticamente en 8 horas
      );

      // Respondemos con tu formato Success inyectando el Token
      res.json({
        ok: true,
        data: {
          token: token,
          user: { id: user.id, username: user.username, email: user.email },
        },
      });
    } catch (error) {
      res.status(500).json({ ok: false, error: { message: error.message } });
    }
  },
};

module.exports = authController;
