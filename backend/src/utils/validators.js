/**
 * validators.js — Constantes y funciones de validación de dominio.
 * Funciones puras sin dependencias externas.
 */

/** Regex de validación de formato de email. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valores permitidos para Course.level (alineados con CHECK constraint del esquema). */
const VALID_LEVELS = ['Inicial', 'Intermedio', 'Avanzado'];

/** Valores permitidos para User.role (alineados con CHECK constraint del esquema). */
const VALID_ROLES = ['STUDENT', 'ADMIN'];

/**
 * Verifica si un string tiene formato de email válido.
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => EMAIL_REGEX.test(email);

/**
 * Verifica si un valor está entre los niveles permitidos de curso.
 * @param {string} level
 * @returns {boolean}
 */
const isValidLevel = (level) => VALID_LEVELS.includes(level);

/**
 * Verifica que un string no supere la longitud máxima indicada.
 * @param {string} str
 * @param {number} max
 * @returns {boolean}
 */
const hasMaxLength = (str, max) => typeof str === 'string' && str.length <= max;

module.exports = {
  EMAIL_REGEX,
  VALID_LEVELS,
  VALID_ROLES,
  isValidEmail,
  isValidLevel,
  hasMaxLength,
};
