/**
 * errorHandler.js — Middleware global de manejo de errores (4 argumentos).
 * Debe montarse como el ÚLTIMO middleware en app.js.
 *
 * Prioridad de resolución:
 *   1. Error de PostgreSQL (err.code reconocido en pgErrors.js) → 400 + mensaje descriptivo
 *   2. Error controlado con err.status explícito → ese status + err.message
 *   3. Cualquier otro error inesperado → 500 genérico
 */

const { mapPgError } = require('../utils/pgErrors');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // 1. Error de PostgreSQL con código conocido
  const pgMapped = mapPgError(err);
  if (pgMapped) {
    return res.status(pgMapped.status).json({ error: pgMapped.message });
  }

  // 2. Error controlado lanzado con status explícito (ej. new Error('...') con err.status)
  if (err.status && Number.isInteger(err.status) && err.status >= 400 && err.status < 600) {
    return res.status(err.status).json({ error: err.message || 'Error en la solicitud.' });
  }

  // 3. Error inesperado — loguear internamente, responder de forma segura
  console.error('[ERROR NO CONTROLADO]', err);
  return res.status(500).json({ error: 'Error interno del servidor.' });
};

module.exports = errorHandler;
