const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios (nombre, email, password).'
      });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(409).json({
        error: 'El correo electrónico ya está registrado.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: passwordHash
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        creadoEn: true
      }
    });

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: nuevoUsuario
    });
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({
      error: 'Error interno del servidor al registrar el usuario.'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Debes ingresar email y contraseña.'
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas.'
      });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({
        error: 'Credenciales inválidas.'
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      error: 'Error interno del servidor al iniciar sesión.'
    });
  }
};

module.exports = {
  register,
  login
};