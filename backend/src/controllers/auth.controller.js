/**
 * auth.controller.js — Capa HTTP de autenticación.
 * Solo parsea req.body, delega en authService y serializa la respuesta.
 * Sin pool, sin SQL, sin bcrypt, sin jwt.
 */

const authService = require('../services/auth.service');

// ── POST /api/auth/register ───────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const newUser = await authService.register(req.body);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { token, user } = await authService.login(req.body);

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
