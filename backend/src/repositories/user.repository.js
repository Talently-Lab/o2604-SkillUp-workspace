/**
 * user.repository.js — Acceso a datos de la tabla "User".
 * Único lugar de Auth que importa pool y ejecuta SQL.
 */

const { pool } = require('../config/db');

/**
 * Busca un usuario por email.
 * Incluye `password` para que auth.service pueda comparar el hash.
 * @param {string} email — ya normalizado (lowercase, trimmed)
 * @returns {Promise<{ id, name, email, password, role } | undefined>}
 */
const findByEmail = async (email) => {
  const result = await pool.query(
    'SELECT id, name, email, password, role FROM "User" WHERE email = $1 LIMIT 1',
    [email]
  );
  return result.rows[0];
};

/**
 * Busca un usuario por id. No devuelve `password`.
 * @param {number} id
 * @returns {Promise<{ id, name, email, role, createdAt } | undefined>}
 */
const findById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, email, role, "createdAt" FROM "User" WHERE id = $1 LIMIT 1',
    [id]
  );
  return result.rows[0];
};

/**
 * Inserta un nuevo usuario y retorna los campos públicos.
 * @param {{ name: string, email: string, passwordHash: string, role?: string }} param
 * @returns {Promise<{ id, name, email, role, createdAt }>}
 */
const create = async ({ name, email, passwordHash, role = 'STUDENT' }) => {
  const result = await pool.query(
    `INSERT INTO "User" (name, email, password, role, "updatedAt")
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, name, email, role, "createdAt"`,
    [name, email, passwordHash, role]
  );
  return result.rows[0];
};

/**
 * Devuelve todos los usuarios sin exponer la contraseña.
 * Usado por admin.service para el panel de administración.
 * @returns {Promise<Array<{ id, name, email, role, createdAt }>>}
 */
const findAll = async () => {
  const result = await pool.query(
    'SELECT id, name, email, role, "createdAt" FROM "User" ORDER BY id ASC'
  );
  return result.rows;
};

module.exports = { findByEmail, findById, create, findAll };
