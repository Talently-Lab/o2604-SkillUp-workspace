require('dotenv').config();
const express       = require('express');
const cors          = require('cors');
const authRoutes    = require('./routes/auth.routes');
const coursesRoutes = require('./routes/courses.routes');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parser con límite de tamaño ─────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'API de SkillUp Campus funcionando correctamente',
    status: 'OK',
  });
});

// ── Rutas ─────────────────────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/courses', coursesRoutes);

// ── Inicio del servidor ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor SkillUp corriendo en http://localhost:${PORT}`);
});
