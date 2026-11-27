/**
 * category.repository.js — Acceso a datos de la tabla "Category".
 * Único lugar que importa pool para operaciones de categorías.
 */

const { pool } = require('../config/db');

/**
 * Devuelve todas las categorías ordenadas alfabéticamente.
 * @returns {Promise<Array<{ id: number, name: string }>>}
 */
const findAll = async () => {
  const result = await pool.query(
    'SELECT id, name FROM "Category" ORDER BY name ASC'
  );
  return result.rows;
};

/**
 * Busca una categoría por su ID.
 * @param {number} id
 * @returns {Promise<{ id: number, name: string } | undefined>}
 */
const findById = async (id) => {
  const result = await pool.query(
    'SELECT id, name FROM "Category" WHERE id = $1 LIMIT 1',
    [id]
  );
  return result.rows[0];
};

module.exports = { findAll, findById };
