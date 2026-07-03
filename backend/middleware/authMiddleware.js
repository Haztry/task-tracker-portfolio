const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // 1. Obtener el token del header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      error: { code: "UNAUTHORIZED", message: "Acceso denegado. Token no proporcionado." },
    });
  }

  // 2. Extraer el token quitando la palabra 'Bearer '
  const token = authHeader.split(" ")[1];

  try {
    // 3. Verificar que el token sea auténtico y no haya expirado
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Inyectar los datos del usuario logueado en el objeto 'req'
    // para que el controlador sepa quién está haciendo la petición
    req.user = decoded;

    next(); // Le damos el pase al siguiente paso (el controlador)
  } catch (error) {
    return res.status(401).json({
      ok: false,
      error: { code: "INVALID_TOKEN", message: "Token inválido o expirado." },
    });
  }
};

module.exports = protect;
