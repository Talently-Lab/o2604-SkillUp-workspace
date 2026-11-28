
SkillUp Campus - Frontend
Frontend en React + Vite + Tailwind + DaisyUI.
Rol: Fabián — Frontend (@fbndgcba)

Cómo correrlo.

cd frontend
npm install
npm run dev
Abre en http://localhost:5173

Backend esperado en http://localhost:3001/api

Variables de entorno
Crear un archivo .env en frontend/ con:

VITE_API_URL=http://localhost:3001/api
Si no existe .env, usa por defecto http://localhost:3001/api (definido en src/api/api.js).

Flujo que implementa
Registro: POST /api/auth/register — llama a sign_up() en api.js, guarda token en localStorage.
Login: POST /api/auth/login — llama a login() en api.js, guarda token + user en localStorage.
Catálogo: GET /api/courses — acepta array directo o { data: [...] }.
Detalle: GET /api/courses + filtro por id.
Inscripción: POST /api/enrollments con { course_id, courseId } + Authorization: Bearer <token>.
Mis cursos: GET /api/enrollments/me — pendiente de backend. Hoy Dashboard muestra Empty State cuando enrolledCount === 0.

Archivos principales.

src/api/api.js — conexión central a la API. login, sign_up, getCourses, enroll, logout, trackEvent.
src/pages/Home.jsx — Inicio, Hero, Cursos destacados (primeros 3).
src/pages/Catalogo.jsx — Catálogo con filtros, grupos y fallback local.
src/pages/CursoDetalle.jsx — Detalle + botón Inscribirme.
src/pages/DashboardUsuario.jsx — Mi campus + Empty State.
src/pages/Login.jsx — Login con validación junto al campo.
src/pages/Register.jsx — Registro con validación junto al campo.
src/pages/Navbar.jsx — Navbar con sesión y logout.

Fallbacks (para que no se rompa si el backend no responde).

Si GET /api/courses falla, Catálogo muestra cursos MKTG locales (CURSOS_MKTG en Catalogo.jsx).
Si POST /api/enrollments da 404 / 500, Detalle muestra mensaje sin romper la pantalla.
Si no hay conexión (NO_CONNECTION), Login entra en modo demo.
Email siempre normalizado a minúsculas (CP-LOGIN-09).

Notas para QA.

Para probar Semana 4: probar Registro + Login con datos reales contra la rama feat/semana-5-enrollments (PR #2).
Casos de backend reportados por Claudia (7:46 PM): CP-API-006, CP-API-015, CP-API-026, CP-API-027 — en manos de backend.
No usar el repo personal de Rodolfo. Solo repo oficial Talently-Lab/o2604-SkillUp-workspace.
