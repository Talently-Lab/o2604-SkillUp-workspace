/**
 * courses.service.js — Lógica de negocio de cursos.
 * Sin pool, sin req/res. Lanza errores con .status para errorHandler.js.
 */

const courseRepository   = require('../repositories/course.repository');
const categoryRepository = require('../repositories/category.repository');
const { sanitizeString, parsePositiveInt } = require('../utils/sanitize');
const { isValidLevel, hasMaxLength }       = require('../utils/validators');

// ── Helper interno ────────────────────────────────────────────────────────────

const httpError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// ── Validación de categoryId ──────────────────────────────────────────────────

/**
 * Valida que categoryId sea null/undefined o un entero positivo que exista en BD.
 * @param {unknown} rawCategoryId
 * @returns {Promise<number|null>} El categoryId validado, o null.
 */
const resolveCategory = async (rawCategoryId) => {
  if (rawCategoryId === null || rawCategoryId === undefined) return null;

  const id = parsePositiveInt(rawCategoryId);
  if (!id) {
    throw httpError('categoryId debe ser un entero positivo', 400);
  }

  const cat = await categoryRepository.findById(id);
  if (!cat) {
    throw httpError('La categoría indicada no existe', 400);
  }

  return id;
};

// ── getAllCourses ─────────────────────────────────────────────────────────────

/**
 * Catálogo público: solo cursos publicados.
 * @returns {Promise<Array>}
 */
const getAllCourses = async () => {
  return courseRepository.findAll({ isPublished: true });
};

// ── getCourseById ─────────────────────────────────────────────────────────────

/**
 * @param {unknown} rawId
 * @returns {Promise<object>}
 */
const getCourseById = async (rawId) => {
  const id = parsePositiveInt(rawId);
  if (!id) {
    throw httpError('El ID del curso debe ser un número entero positivo', 400);
  }

  const course = await courseRepository.findById(id);
  if (!course) {
    throw httpError('Curso no encontrado', 404);
  }

  return course;
};

// ── createCourse ──────────────────────────────────────────────────────────────

/**
 * @param {object} payload — req.body
 * @returns {Promise<object>} Curso creado
 */
const createCourse = async (payload) => {
  // Sanitización
  const title       = sanitizeString(payload.title);
  const description = sanitizeString(payload.description);
  const instructor  = sanitizeString(payload.instructor);
  const duration    = sanitizeString(payload.duration);

  // Campos obligatorios
  if (!title || !description || !instructor || !duration) {
    throw httpError(
      'Los campos title, description, instructor y duration son obligatorios',
      400
    );
  }

  // Longitudes máximas (alineadas con VARCHAR del esquema)
  if (!hasMaxLength(title, 200)) {
    throw httpError('El título no puede superar los 200 caracteres', 400);
  }
  if (!hasMaxLength(instructor, 120)) {
    throw httpError('El instructor no puede superar los 120 caracteres', 400);
  }
  if (!hasMaxLength(duration, 60)) {
    throw httpError('La duración no puede superar los 60 caracteres', 400);
  }

  // level
  const level = payload.level !== undefined ? sanitizeString(payload.level) : 'Inicial';
  if (!isValidLevel(level)) {
    throw httpError(
      `El nivel debe ser uno de: 'Inicial', 'Intermedio', 'Avanzado'`,
      400
    );
  }

  // isPublished
  let isPublished = true;
  if (payload.isPublished !== undefined) {
    if (typeof payload.isPublished !== 'boolean') {
      throw httpError('isPublished debe ser un valor booleano (true o false)', 400);
    }
    isPublished = payload.isPublished;
  }

  // categoryId
  const categoryId = await resolveCategory(payload.categoryId);

  return courseRepository.create({ title, description, instructor, duration, level, isPublished, categoryId });
};

// ── updateCourse ──────────────────────────────────────────────────────────────

/**
 * @param {unknown} rawId
 * @param {object} payload — req.body
 * @returns {Promise<object>} Curso actualizado
 */
const updateCourse = async (rawId, payload) => {
  // Validar ID
  const id = parsePositiveInt(rawId);
  if (!id) {
    throw httpError('El ID del curso debe ser un número entero positivo', 400);
  }

  // Verificar existencia
  const existing = await courseRepository.findById(id);
  if (!existing) {
    throw httpError('Curso no encontrado', 404);
  }

  // Construir objeto de campos a actualizar (solo los recibidos)
  const fields = {};

  if (payload.title !== undefined) {
    const title = sanitizeString(payload.title);
    if (!title) throw httpError('El título no puede estar vacío', 400);
    if (!hasMaxLength(title, 200)) throw httpError('El título no puede superar los 200 caracteres', 400);
    fields.title = title;
  }

  if (payload.description !== undefined) {
    const description = sanitizeString(payload.description);
    if (!description) throw httpError('La descripción no puede estar vacía', 400);
    fields.description = description;
  }

  if (payload.instructor !== undefined) {
    const instructor = sanitizeString(payload.instructor);
    if (!instructor) throw httpError('El instructor no puede estar vacío', 400);
    if (!hasMaxLength(instructor, 120)) throw httpError('El instructor no puede superar los 120 caracteres', 400);
    fields.instructor = instructor;
  }

  if (payload.duration !== undefined) {
    const duration = sanitizeString(payload.duration);
    if (!duration) throw httpError('La duración no puede estar vacía', 400);
    if (!hasMaxLength(duration, 60)) throw httpError('La duración no puede superar los 60 caracteres', 400);
    fields.duration = duration;
  }

  if (payload.level !== undefined) {
    const level = sanitizeString(payload.level);
    if (!isValidLevel(level)) {
      throw httpError(`El nivel debe ser uno de: 'Inicial', 'Intermedio', 'Avanzado'`, 400);
    }
    fields.level = level;
  }

  if (payload.isPublished !== undefined) {
    if (typeof payload.isPublished !== 'boolean') {
      throw httpError('isPublished debe ser un valor booleano (true o false)', 400);
    }
    fields.isPublished = payload.isPublished;
  }

  // categoryId: acepta null explícito para limpiar la FK
  if (Object.prototype.hasOwnProperty.call(payload, 'categoryId')) {
    fields.categoryId = await resolveCategory(payload.categoryId);
  }

  const updated = await courseRepository.update(id, fields);
  return updated;
};

// ── deleteCourse ──────────────────────────────────────────────────────────────

/**
 * @param {unknown} rawId
 * @returns {Promise<{ id: number, title: string }>}
 */
const deleteCourse = async (rawId) => {
  const id = parsePositiveInt(rawId);
  if (!id) {
    throw httpError('El ID del curso debe ser un número entero positivo', 400);
  }

  // Obtenemos el título antes de borrar para incluirlo en la respuesta
  const existing = await courseRepository.findById(id);
  if (!existing) {
    throw httpError('Curso no encontrado', 404);
  }

  await courseRepository.deleteById(id);
  return { id: existing.id, title: existing.title };
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };
