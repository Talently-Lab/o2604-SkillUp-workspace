# SkillUp Campus — Backend API

API REST desarrollada con Node.js, Express 5 y PostgreSQL (`pg`) conectada a Supabase.

## Requisitos previos
- Node.js v18 o superior
- Proyecto en Supabase (o instancia PostgreSQL)

## Instalación y configuración

1. Entrar a la carpeta del backend e instalar dependencias:
   ```bash
   cd backend
   npm install
   ```

2. Crear el archivo `.env` a partir de `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Completar las variables en `backend/.env` con los datos de tu proyecto en Supabase (**Connect → Session pooler**, puerto `5432`):
   ```env
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION][.pooler.supabase.com:5432/postgres](https://.pooler.supabase.com:5432/postgres)
   JWT_SECRET=tu_clave_secreta_jwt_aqui
   ```

4. Crear las tablas en Supabase ejecutando el script ubicado en `../docs/database/supabase_schema.sql` dentro del **SQL Editor**.

5. Levantar el servidor:
   ```bash
   # Modo desarrollo
   npm run dev

   # Modo producción
   npm start
   ```

## Endpoints implementados

### Estado del servidor
- `GET /` — Verifica que la API esté activa.

### Autenticación (`/api/auth`)
- `POST /api/auth/register` — Registra un nuevo usuario (`name`, `email`, `password`) con rol `STUDENT` por defecto. Valida formato de email y longitud mínima de contraseña (8 caracteres).
- `POST /api/auth/login` — Autentica al usuario (`email`, `password`) y devuelve un token JWT (expiración 24h) con payload `{ id, role }`.

### Catálogo de Cursos (`/api/courses`)
- `GET /api/courses` — Lista los cursos publicados (`isPublished = true`) junto con su categoría (público).
- `GET /api/courses/:id` — Obtiene el detalle de un curso por ID (público).
- `POST /api/courses` — Crea un nuevo curso (requiere token JWT con rol `ADMIN`).
- `PUT /api/courses/:id` — Actualiza un curso existente (requiere token JWT con rol `ADMIN`).
- `DELETE /api/courses/:id` — Elimina un curso por ID (requiere token JWT con rol `ADMIN`).

### Inscripciones (`/api/enrollments`)
- `POST /api/enrollments` — Inscribe al usuario autenticado en un curso publicado (`{ "courseId": 1 }`). Requiere token JWT. Rechaza inscripciones duplicadas (`409 Conflict`) y cursos no publicados (`400 Bad Request`).
- `GET /api/enrollments/me` — Devuelve el historial de inscripciones del usuario autenticado con la información completa de cada curso y su categoría. Requiere token JWT.

### Administración (`/api/admin`)
- `GET /api/admin/users` — Lista todos los usuarios registrados sin exponer contraseñas (requiere token JWT con rol `ADMIN`).

## Pruebas con Postman
La colección actualizada con todos los endpoints se encuentra en la carpeta `../docs/api/`.