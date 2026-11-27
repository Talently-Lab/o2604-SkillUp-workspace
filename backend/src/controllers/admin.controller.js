/**
 * admin.controller.js — Capa HTTP del panel de administración.
 * Solo delega en adminService y serializa la respuesta.
 * Sin pool, sin SQL, sin validaciones.
 */

const adminService = require('../services/admin.service');

// ── GET /api/admin/users ──────────────────────────────────────────────────────
const getUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers };
