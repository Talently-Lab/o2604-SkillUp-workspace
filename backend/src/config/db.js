require('dotenv').config();
const { Pool } = require('pg');

// ── Validación de variables de entorno críticas ──────────────────────────────
const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`[FATAL] Faltan variables de entorno requeridas: ${missing.join(', ')}`);
  console.error('Copiá .env.example a .env y completá los valores.');
  process.exit(1);
}

// ── Pool de conexiones PostgreSQL ────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Requerido por Supabase (funciona también en local)
});

pool.connect()
  .then((client) => {
    console.log('✅ Base de datos PostgreSQL (Supabase) conectada correctamente');
    client.release();
  })
  .catch((err) => {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    process.exit(1);
  });

module.exports = { pool };
