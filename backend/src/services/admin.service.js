/**
 * admin.service.js — Lógica de negocio del panel de administración.
 * Sin pool, sin req/res. Lanza errores con .status para errorHandler.js.
 */

const userRepository = require('../repositories/user.repository');

// ── getAllUsers ───────────────────────────────────────────────────────────────

/**
 * Devuelve la lista completa de usuarios sin exponer passwords.
 * @returns {Promise<Array<{ id, name, email, role, createdAt }>>}
 */
const getAllUsers = async () => {
  return userRepository.findAll();
};

module.exports = { getAllUsers };
