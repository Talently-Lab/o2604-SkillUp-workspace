-- ============================================================
-- DDL para SkillUp Campus en Supabase (PostgreSQL)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Tabla: User ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "User" (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  role        VARCHAR(20) NOT NULL DEFAULT 'STUDENT'
                CONSTRAINT "User_role_check" CHECK (role IN ('STUDENT', 'ADMIN')),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW()
);

-- ── Tabla: Category ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Category" (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW()
);

-- ── Tabla: Course ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Course" (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  description   TEXT NOT NULL,
  instructor    VARCHAR(120) NOT NULL,
  duration      VARCHAR(60) NOT NULL,
  level         VARCHAR(20) NOT NULL DEFAULT 'Inicial'
                  CONSTRAINT "Course_level_check" CHECK (level IN ('Inicial', 'Intermedio', 'Avanzado')),
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "categoryId"  INT REFERENCES "Category"(id) ON DELETE SET NULL,
  "createdAt"   TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ(3) NOT NULL DEFAULT NOW()
);

-- ── Tabla: Enrollment ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Enrollment" (
  id           SERIAL PRIMARY KEY,
  "userId"     INT NOT NULL REFERENCES "User"(id)   ON DELETE CASCADE,
  "courseId"   INT NOT NULL REFERENCES "Course"(id) ON DELETE CASCADE,
  "enrolledAt" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  CONSTRAINT "Enrollment_userId_courseId_key" UNIQUE ("userId", "courseId")
);

-- ── Triggers para auto-actualizar updatedAt ──────────────────────────────────
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

CREATE OR REPLACE TRIGGER "Category_updatedAt_trigger"
BEFORE UPDATE ON "Category"
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER "Course_updatedAt_trigger"
BEFORE UPDATE ON "Course"
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Índices de performance ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS "Course_categoryId_idx"   ON "Course"("categoryId");
CREATE INDEX IF NOT EXISTS "Enrollment_userId_idx"   ON "Enrollment"("userId");
CREATE INDEX IF NOT EXISTS "Enrollment_courseId_idx" ON "Enrollment"("courseId");

-- ── Datos iniciales opcionales ───────────────────────────────────────────────
-- INSERT INTO "Category" (name) VALUES
--   ('Desarrollo Web'), ('Base de Datos'), ('DevOps'), ('QA y Testing');

-- INSERT INTO "User" (name, email, password, role)
-- VALUES ('Admin SkillUp', 'admin@skillup.com', '<HASH_BCRYPT>', 'ADMIN');

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================