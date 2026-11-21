const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// ── Regex de validación de email ─────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── POST /api/auth/register ───────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    // 1. Sanitización
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    // 2. Presencia de campos obligatorios
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios (name, email, password)',
      });
    }

    // 3. Formato de email (FIX CP-API-010)
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        error: 'El formato del correo electrónico no es válido',
      });
    }

    // 4. Longitud mínima de contraseña
    if (password.length < 8) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 8 caracteres',
      });
    }

    // 5. Verificar duplicado de email
    const existingResult = await pool.query(
      'SELECT id FROM "User" WHERE email = $1 LIMIT 1',
      [email]
    );
    if (existingResult.rows.length > 0) {
      return res.status(400).json({
        error: 'El correo electrónico ya está registrado',
      });
    }

    // 6. Hash de contraseña e inserción
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertResult = await pool.query(
      `INSERT INTO "User" (name, email, password, role, "updatedAt")
       VALUES ($1, $2, $3, 'STUDENT', NOW())
       RETURNING id, name, email, role`,
      [name, email, hashedPassword]
    );

    const newUser = insertResult.rows[0];

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: newUser,
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error interno al registrar el usuario' });
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    // 1. Sanitización
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    // 2. Presencia de campos
    if (!email || !password) {
      return res.status(400).json({
        error: 'Debes ingresar email y password',
      });
    }

    // 3. Formato de email
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        error: 'El formato del correo electrónico no es válido',
      });
    }

    // 4. Buscar usuario en BD
    const result = await pool.query(
      'SELECT id, name, email, password, role FROM "User" WHERE email = $1 LIMIT 1',
      [email]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 5. Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 6. Generar JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 7. Responder sin exponer el hash de contraseña
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno al iniciar sesión' });
  }
};

module.exports = { register, login };
