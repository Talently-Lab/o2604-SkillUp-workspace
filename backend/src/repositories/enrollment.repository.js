/**
 * enrollment.repository.js — Acceso a datos de la tabla "Enrollment".
 * Único archivo de inscripciones que importa pool y ejecuta SQL.
 */

const { pool } = require('../config/db');

// ── findByUserAndCourse ───────────────────────────────────────────────────────

/**
 * Busca si ya existe una inscripción para ese par usuario/curso.
 * @param {number} userId
 * @param {number} courseId
 * @returns {Promise<{ id, userId, courseId, enrolledAt } | undefined>}
 */
const findByUserAndCourse = async (userId, courseId) => {
  const result = await pool.query(
    `SELECT id, "userId", "courseId", "enrolledAt"
     FROM "Enrollment"
     WHERE "userId" = $1 AND "courseId" = $2
     LIMIT 1`,
    [userId, courseId]
  );
  return result.rows[0];
};

// ── create ────────────────────────────────────────────────────────────────────

/**
 * Inserta una nueva inscripción y retorna los campos de la fila creada.
 * @param {{ userId: number, courseId: number }} param
 * @returns {Promise<{ id, userId, courseId, enrolledAt }>}
 */
const create = async ({ userId, courseId }) => {
  const result = await pool.query(
    `INSERT INTO "Enrollment" ("userId", "courseId")
     VALUES ($1, $2)
     RETURNING id, "userId", "courseId", "enrolledAt"`,
    [userId, courseId]
  );
  return result.rows[0];
};

// ── findByUserId ──────────────────────────────────────────────────────────────

/**
 * Devuelve todas las inscripciones de un usuario con los datos completos
 * del curso y su categoría, ordenadas de más reciente a más antigua.
 *
 * @param {number} userId
 * @returns {Promise<Array<{
 *   id, enrolledAt,
 *   courseId, title, description, instructor, duration, level,
 *   categoryId, categoryName
 * }>>}
 */
const findByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT
       e.id,
       e."enrolledAt",
       c.id          AS "courseId",
       c.title,
       c.description,
       c.instructor,
       c.duration,
       c.level,
       c."categoryId",
       cat.name      AS "categoryName"
     FROM "Enrollment" e
     INNER JOIN "Course"   c   ON e."courseId"   = c.id
     LEFT JOIN  "Category" cat ON c."categoryId" = cat.id
     WHERE e."userId" = $1
     ORDER BY e."enrolledAt" DESC`,
    [userId]
  );
  return result.rows;
};

module.exports = { findByUserAndCourse, create, findByUserId };
