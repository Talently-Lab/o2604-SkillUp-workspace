const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Acceso denegado. Token no proporcionado o formato inválido.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido o expirado.'
    });
  }
};

const esAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== 'Admin') {
    return res.status(403).json({
      error: 'Acceso denegado. Se requieren permisos de Administrador.'
    });
  }
  next();
};

module.exports = {
  verificarToken,
  esAdmin
};