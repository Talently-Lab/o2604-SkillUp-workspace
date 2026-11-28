// [Frontend] 1. Conexión a la API (3h) | [US-01]
// Archivo central para todas las llamadas al Backend
// Nomenclatura oficial del cliente - Data Analyst: login y sign_up

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// [PO - Kit Data Analyst] Eventos a trackear: minúsculas_con_guion_bajo
// view_course_list, view_course, click_enroll, enroll_success, sign_up, login
export function trackEvent(event, props = {}) {
  const payload = { event, ...props, at: new Date().toISOString() };
  // 1. Para ver en DevTools > Consola
  console.log("[SkillUp Event]", payload);
  // 2. Guardado local para el reporte del PM - Semanas 1 y 2
  try {
    const prev = JSON.parse(localStorage.getItem("skillup_events") || "[]");
    prev.push(payload);
    localStorage.setItem("skillup_events", JSON.stringify(prev.slice(-200)));
  } catch {}
  // 3. Si backend tiene /api/events, lo manda. Si da 404, no rompe nada.
  fetch(`${API_URL}/events`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => {});
  return payload;
}
export const track = trackEvent;

// Helper para hacer fetch con manejo de errores MKTG Semana 2
async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
  } catch {
    // Sin conexión
    throw new Error("NO_CONNECTION");
  }

  let data = null;
  try { data = await res.json(); } catch { data = null; }

  if (!res.ok) {
    // Backend devuelve { message: "..." } o { error: "..." }
    const msg = data?.message || data?.error || "";
    const err = new Error(msg || `HTTP_${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// Evento: login - [Material del Cliente - Data Analyst]
export async function login(email, password) {
  // QA CP-LOGIN-09 - Normalizar acá también, por si alguien llama sin normalizar
  const normalizedEmail = String(email || "").trim().toLowerCase();
  // POST /api/auth/login - retorna { token, user }
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: normalizedEmail, password }),
  });
  // Guardar sesión
  trackEvent("login", {});
  if (data?.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user || { email: normalizedEmail }));
  }
  return data;
}

// Evento: sign_up - [Material del Cliente - Data Analyst]
// Ojo: en código el evento se llama sign_up, en pantalla el botón dice "Crear mi cuenta"
export async function sign_up(name, email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  // POST /api/auth/register - Rodolfo usa /register, no /signup
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email: normalizedEmail, password }),
  });
  // Origen: de donde vino - home o curso. Si no se pasa, queda "register"
  trackEvent("sign_up", { origen: "register" });
  return data;
}

export async function getCourses() {
  return request("/courses", { method: "GET" });
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getToken() {
  return localStorage.getItem("token");
}

export { API_URL };
export default { login, sign_up, getCourses, logout, getToken, API_URL };

// [PO - Kit Data Analyst] Inscripción
// click_enroll: cuando toca "Inscribirme" - props: course_id, logueado (si/no)
// enroll_success: cuando la API confirma 201 - props: course_id
export async function enroll(course_id) {
  const token = localStorage.getItem("token");
  trackEvent("click_enroll", { course_id, logueado: token ? "si" : "no" });
  const data = await request("/enrollments", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify({ course_id, courseId: course_id }),
  });
  trackEvent("enroll_success", { course_id });
  return data;
}