/**
 * course.repository.js — Acceso a datos de la tabla "Course".
 * Único lugar que importa pool para operaciones de cursos.
 * Nunca usa SELECT *; siempre proyecta columnas explícitas.
 */

const { pool } = require('../config/db');

// Proyección base reutilizada en todas las queries de lectura
const BASE_SELECT = `
  SELECT
    c.id,
    c.title,
    c.description,
    c.instructor,
    c.duration,
    c.level,
    c."isPublished",
    c."categoryId",
    cat.name AS "categoryName",
    c."createdAt"
  FROM "Course" c
  LEFT JOIN "Category" cat ON c."categoryId" = cat.id
`;

// ── findAll ───────────────────────────────────────────────────────────────────

/**
 * Devuelve cursos con filtros opcionales y seguros (sin SQL injection).
 *
 * Filtros soportados en `filters`:
 *   - `isPublished` {boolean}  → WHERE c."isPublished" = $n
 *   - `categoryId`  {number}   → WHERE c."categoryId"  = $n
 *
 * Si `filters` está vacío ({}) devuelve todos los cursos (útil para admin).
 *
 * @param {{ isPublished?: boolean, categoryId?: number }} [filters={}]
 * @returns {Promise<Array>}
 */
const findAll = async (filters = {}) => {
  const conditions = [];
  const values = [];

  if (typeof filters.isPublished === 'boolean') {
    values.push(filters.isPublished);
    conditions.push(`c."isPublished" = $${values.length}`);
  }

  if (filters.categoryId !== undefined) {
    values.push(filters.categoryId);
    conditions.push(`c."categoryId" = $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `${BASE_SELECT} ${where} ORDER BY c.id ASC`;

  const result = await pool.query(sql, values);
  return result.rows;
};

// ── findById ──────────────────────────────────────────────────────────────────

/**
 * Busca un curso por su ID incluyendo nombre de categoría.
 * @param {number} id
 * @returns {Promise<object | undefined>}
 */
const findById = async (id) => {
  const result = await pool.query(
    `${BASE_SELECT} WHERE c.id = $1 LIMIT 1`,
    [id]
  );
  return result.rows[0];
};

// ── create ────────────────────────────────────────────────────────────────────

/**
 * Inserta un nuevo curso y retorna el registro creado (con JOIN de categoría).
 * @param {{ title, description, instructor, duration, level, isPublished, categoryId }} param
 * @returns {Promise<object>}
 */
const create = async ({ title, description, instructor, duration, level, isPublished, categoryId }) => {
  const result = await pool.query(
    `INSERT INTO "Course"
       (title, description, instructor, duration, level, "isPublished", "categoryId", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
     RETURNING id`,
    [title, description, instructor, duration, level, isPublished, categoryId ?? null]
  );
  // Re-fetch con JOIN para devolver shape consistente con findAll/findById
  return findById(result.rows[0].id);
};

// ── update ────────────────────────────────────────────────────────────────────

/**
 * Actualiza dinámicamente solo los campos recibidos en `fields`.
 * Soporta `categoryId: null` para limpiar la FK explícitamente.
 *
 * @param {number} id
 * @param {{ title?, description?, instructor?, duration?, level?, isPublished?, categoryId? }} fields
 * @returns {Promise<object | undefined>} Registro actualizado o undefined si no existía.
 */
const update = async (id, fields) => {
  const ALLOWED = ['title', 'description', 'instructor', 'duration', 'level', 'isPublished', 'categoryId'];
  const setClauses = [];
  const values = [];

  for (const key of ALLOWED) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      values.push(fields[key]);
      // Columnas con camelCase necesitan comillas en PostgreSQL
      const col = key === 'isPublished' || key === 'categoryId' ? `"${key}"` : key;
      setClauses.push(`${col} = $${values.length}`);
    }
  }

  if (setClauses.length === 0) return findById(id); // nada que actualizar

  // updatedAt lo maneja el trigger; lo sobreescribimos igual para consistencia
  setClauses.push(`"updatedAt" = NOW()`);

  values.push(id);
  const sql = `
    UPDATE "Course"
    SET ${setClauses.join(', ')}
    WHERE id = $${values.length}
    RETURNING id
  `;

  const result = await pool.query(sql, values);
  if (result.rows.length === 0) return undefined;

  return findById(result.rows[0].id);
};

// ── deleteById ────────────────────────────────────────────────────────────────

/**
 * Elimina un curso por ID.
 * @param {number} id
 * @returns {Promise<boolean>} true si se eliminó, false si no existía.
 */
const deleteById = async (id) => {
  const result = await pool.query(
    'DELETE FROM "Course" WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rows.length > 0;
};

module.exports = { findAll, findById, create, update, deleteById };
