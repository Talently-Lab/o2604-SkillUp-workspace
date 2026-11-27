/**
 * enrollments.service.js — Lógica de negocio de inscripciones.
 * Sin pool, sin req/res. Lanza errores con .status para errorHandler.js.
 */

const enrollmentRepository = require('../repositories/enrollment.repository');
const courseRepository     = require('../repositories/course.repository');
const { parsePositiveInt }  = require('../utils/sanitize');

// ── Helper interno ────────────────────────────────────────────────────────────

const httpError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// ── enrollUser ────────────────────────────────────────────────────────────────

/**
 * Inscribe al usuario autenticado en un curso.
 *
 * @param {{ userId: number, rawCourseId: unknown }} param
 * @returns {Promise<{ id, userId, courseId, enrolledAt }>}
 */
const enrollUser = async ({ userId, rawCourseId }) => {
  // 1. Validar que courseId sea un entero positivo
  const courseId = parsePositiveInt(rawCourseId);
  if (!courseId) {
    throw httpError('El courseId debe ser un número entero positivo', 400);
  }

  // 2. Verificar que el curso exista
  const course = await courseRepository.findById(courseId);
  if (!course) {
    throw httpError('Curso no encontrado', 404);
  }

  // 3. Verificar que el curso esté publicado
  if (!course.isPublished) {
    throw httpError('El curso no está disponible para inscripciones', 400);
  }

  // 4. Verificar que el usuario no esté ya inscripto
  const existing = await enrollmentRepository.findByUserAndCourse(userId, courseId);
  if (existing) {
    throw httpError('Ya estás inscripto en este curso.', 409);
  }

  // 5. Crear la inscripción
  return enrollmentRepository.create({ userId, courseId });
};

// ── getUserEnrollments ────────────────────────────────────────────────────────

/**
 * Devuelve las inscripciones del usuario con datos del curso anidados.
 *
 * @param {number} userId
 * @returns {Promise<Array<{
 *   id: number,
 *   enrolledAt: string,
 *   course: { id, title, description, instructor, duration, level, categoryId, categoryName }
 * }>>}
 */
const getUserEnrollments = async (userId) => {
  const rows = await enrollmentRepository.findByUserId(userId);

  return rows.map((row) => ({
    id:         row.id,
    enrolledAt: row.enrolledAt,
    course: {
      id:           row.courseId,
      title:        row.title,
      description:  row.description,
      instructor:   row.instructor,
      duration:     row.duration,
      level:        row.level,
      categoryId:   row.categoryId,
      categoryName: row.categoryName,
    },
  }));
};

module.exports = { enrollUser, getUserEnrollments };
