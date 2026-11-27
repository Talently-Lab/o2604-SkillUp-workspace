/**
 * auth.service.js — Lógica de negocio de autenticación.
 * No importa pool ni Express. Lanza errores con .status para que
 * errorHandler.js los convierta en la respuesta HTTP correcta.
 */

const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const userRepository  = require('../repositories/user.repository');
const { sanitizeString } = require('../utils/sanitize');
const { isValidEmail, hasMaxLength } = require('../utils/validators');

// ── Helpers internos ──────────────────────────────────────────────────────────

/**
 * Crea un Error con un código de estado HTTP adjunto.
 * @param {string} message
 * @param {number} status
 * @returns {Error & { status: number }}
 */
const httpError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// ── register ──────────────────────────────────────────────────────────────────

/**
 * Registra un nuevo usuario.
 * @param {{ name: string, email: string, password: string }} rawInput
 * @returns {Promise<{ id, name, email, role, createdAt }>}
 */
const register = async ({ name: rawName, email: rawEmail, password: rawPassword }) => {
  // 1. Sanitización
  const name     = sanitizeString(rawName);
  const email    = sanitizeString(rawEmail).toLowerCase();
  const password = typeof rawPassword === 'string' ? rawPassword : '';

  // 2. Presencia de campos obligatorios
  if (!name || !email || !password) {
    throw httpError('Todos los campos son obligatorios (name, email, password)', 400);
  }

  // 3. Formato de email
  if (!isValidEmail(email)) {
    throw httpError('El formato del correo electrónico no es válido', 400);
  }

  // 4. Longitudes máximas (alineadas con VARCHAR del esquema)
  if (!hasMaxLength(name, 120)) {
    throw httpError('El nombre no puede superar los 120 caracteres', 400);
  }
  if (!hasMaxLength(email, 150)) {
    throw httpError('El correo electrónico no puede superar los 150 caracteres', 400);
  }

  // 5. Longitud mínima de contraseña
  if (password.length < 8) {
    throw httpError('La contraseña debe tener al menos 8 caracteres', 400);
  }

  // 6. Verificar duplicado de email (pre-check para mantener compatibilidad con QA)
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw httpError('El correo electrónico ya está registrado', 400);
  }

  // 7. Hash y persistencia — cualquier error de constraint (23505 race condition)
  //    lo captura errorHandler vía pgErrors.js
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await userRepository.create({ name, email, passwordHash });

  return newUser;
};

// ── login ─────────────────────────────────────────────────────────────────────

/**
 * Autentica un usuario y retorna un JWT junto con los datos públicos del usuario.
 * @param {{ email: string, password: string }} rawInput
 * @returns {Promise<{ token: string, user: { id, name, email, role } }>}
 */
const login = async ({ email: rawEmail, password: rawPassword }) => {
  // 1. Sanitización
  const email    = sanitizeString(rawEmail).toLowerCase();
  const password = typeof rawPassword === 'string' ? rawPassword : '';

  // 2. Presencia de campos
  if (!email || !password) {
    throw httpError('Debes ingresar email y password', 400);
  }

  // 3. Formato de email
  if (!isValidEmail(email)) {
    throw httpError('El formato del correo electrónico no es válido', 400);
  }

  // 4. Buscar usuario
  const user = await userRepository.findByEmail(email);

  // 5. Verificar contraseña (mensaje genérico para no filtrar si el email existe)
  const isValidPassword = user ? await bcrypt.compare(password, user.password) : false;
  if (!user || !isValidPassword) {
    throw httpError('Credenciales inválidas', 401);
  }

  // 6. Firmar JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      id:    user.id,
      name:  user.name,
      email: user.email,
      role:  user.role,
    },
  };
};

module.exports = { register, login };
