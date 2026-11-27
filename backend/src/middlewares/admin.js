// Middleware de rol: verifica que el usuario autenticado tenga rol ADMIN.
// Debe ejecutarse DESPUÉS del middleware auth.js (que popula req.user).
// La comparación usa toLowerCase() para tolerar variantes de case en el token.
module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Acceso denegado. Se requieren permisos de Administrador.',
    });
  }
  next();
};
