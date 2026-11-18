require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const cursoRoutes = require('./routes/cursoRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de verificación de estado
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API de SkillUp Campus operativa' });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/cursos', cursoRoutes);

// Iniciar servidor y comprobar conexión con Supabase
const iniciarServidor = async () => {
  try {
    await prisma.$connect();
    const totalCategorias = await prisma.categoria.count();
    console.log(`Conectado a PostgreSQL (Supabase) - Categorías en BD: ${totalCategorias}`);

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

iniciarServidor();