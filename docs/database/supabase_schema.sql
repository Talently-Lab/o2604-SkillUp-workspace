-- ============================================================
-- DDL para SkillUp Campus en Supabase (PostgreSQL)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Tipos personalizados ─────────────────────────────────────────────────────
-- Nota: Supabase no admite CREATE TYPE ENUM directamente en este contexto,
-- se usa TEXT con CHECK CONSTRAINT (compatible con el código actual).

-- ── Tabla: User ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "User" (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'STUDENT'
                CONSTRAINT "User_role_check" CHECK (role IN ('STUDENT', 'ADMIN')),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW()
);

-- ── Tabla: Course ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Course" (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  instructor  TEXT NOT NULL,
  duration    TEXT NOT NULL,
  level       TEXT NOT NULL DEFAULT 'Inicial',
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW()
);

-- ── Tabla: Enrollment ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Enrollment" (
  id           SERIAL PRIMARY KEY,
  "userId"     INT NOT NULL REFERENCES "User"(id)   ON DELETE CASCADE,
  "courseId"   INT NOT NULL REFERENCES "Course"(id) ON DELETE CASCADE,
  "enrolledAt" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  CONSTRAINT "Enrollment_userId_courseId_key" UNIQUE ("userId", "courseId")
);

-- ── Trigger para auto-actualizar updatedAt en User ───────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER "User_updatedAt_trigger"
BEFORE UPDATE ON "User"
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER "Course_updatedAt_trigger"
BEFORE UPDATE ON "Course"
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Índices de performance ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS "User_email_idx"         ON "User"("email");
CREATE INDEX IF NOT EXISTS "Enrollment_userId_idx"  ON "Enrollment"("userId");
CREATE INDEX IF NOT EXISTS "Enrollment_courseId_idx" ON "Enrollment"("courseId");

-- ── Usuario ADMIN inicial (opcional - cambiá el password después) ─────────────
-- INSERT INTO "User" (name, email, password, role)
-- VALUES ('Admin SkillUp', 'admin@skillup.com', '<HASH_BCRYPT>', 'ADMIN');

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
