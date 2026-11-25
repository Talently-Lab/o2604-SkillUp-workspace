/**
 * sanitize.js — Helpers de sanitización de entrada
 * Funciones puras sin dependencias externas.
 */

/**
 * Devuelve value.trim() si es string, o '' en caso contrario.
 * @param {unknown} value
 * @returns {string}
 */
const sanitizeString = (value) =>
  typeof value === 'string' ? value.trim() : '';

/**
 * Parsea un entero positivo (> 0) desde cualquier valor.
 * @param {unknown} value
 * @returns {number|null} El entero positivo, o null si no es válido.
 */
const parsePositiveInt = (value) => {
  const n = parseInt(value, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
};

module.exports = { sanitizeString, parsePositiveInt };
