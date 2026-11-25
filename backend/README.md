# SkillUp Campus — Backend API

API REST desarrollada con Node.js, Express 5 y PostgreSQL conectada a Supabase.

## Requisitos previos
- Node.js v18 o superior
- Proyecto en Supabase (o instancia PostgreSQL)

## Instalación y configuración

1. Entrar a la carpeta del backend e instalar dependencias:
   cd backend
   npm install

2. Crear el archivo `.env` a partir de `.env.example`:
   bash
   cp .env.example .env

3. Completar las variables en `backend/.env` con los datos de tu proyecto en Supabase

4. Crear las tablas en Supabase ejecutando el script ubicado en `../docs/database/supabase_schema.sql`.

5. Levantar el servidor:

   npm run dev

## Pruebas con Postman
La colección actualizada con todos los endpoints se encuentra en la carpeta `../docs/api/`.
