/**
 * pgErrors.js — Traducción de códigos de error de PostgreSQL a respuestas HTTP.
 *
 * Referencia de códigos: https://www.postgresql.org/docs/current/errcodes-appendix.html
 */

/** @type {Record<string, { status: number, message: string }>} */
const PG_ERROR_MAP = {
  /** unique_violation — el valor ya existe en la tabla */
  '23505': {
    status: 400,
    message: 'El registro ya existe (valor duplicado).',
  },
  /** foreign_key_violation — la FK referenciada no existe */
  '23503': {
    status: 400,
    message: 'La referencia indicada no existe.',
  },
  /** check_violation — valor rechazado por un CHECK constraint */
  '23514': {
    status: 400,
    message: 'Uno de los valores enviados no está permitido.',
  },
  /** string_data_right_truncation — texto supera el largo de la columna */
  '22001': {
    status: 400,
    message: 'Uno de los textos supera la longitud máxima permitida.',
  },
};

/**
 * Recibe un error de pg y devuelve el objeto { status, message } correspondiente,
 * o null si el código no está mapeado.
 *
 * @param {Error & { code?: string }} pgError
 * @returns {{ status: number, message: string } | null}
 */
const mapPgError = (pgError) =>
  pgError?.code ? (PG_ERROR_MAP[pgError.code] ?? null) : null;

module.exports = { mapPgError, PG_ERROR_MAP };
