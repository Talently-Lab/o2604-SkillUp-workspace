const { pool } = require('../config/db');

// ── Helper: validar que un parámetro de ruta sea un entero positivo ───────────
const parseId = (raw) => {
  const n = parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// ── GET /api/courses ──────────────────────────────────────────────────────────
const getAllCourses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Course" ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error en getAllCourses:', error);
    res.status(500).json({ error: 'Error al obtener el catálogo de cursos' });
  }
};

// ── GET /api/courses/:id ──────────────────────────────────────────────────────
const getCourseById = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'El ID del curso debe ser un número entero positivo' });
    }

    const result = await pool.query(
      'SELECT * FROM "Course" WHERE id = $1 LIMIT 1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error en getCourseById:', error);
    res.status(500).json({ error: 'Error al obtener el detalle del curso' });
  }
};

// ── POST /api/courses ─────────────────────────────────────────────────────────
const createCourse = async (req, res) => {
  try {
    // Sanitización
    const title       = typeof req.body.title       === 'string' ? req.body.title.trim()       : '';
    const description = typeof req.body.description === 'string' ? req.body.description.trim() : '';
    const instructor  = typeof req.body.instructor  === 'string' ? req.body.instructor.trim()  : '';
    const duration    = typeof req.body.duration    === 'string' ? req.body.duration.trim()    : '';
    const level       = typeof req.body.level       === 'string' && req.body.level.trim()
      ? req.body.level.trim()
      : 'Inicial';

    // Validación de campos obligatorios
    if (!title || !description || !instructor || !duration) {
      return res.status(400).json({
        error: 'Los campos title, description, instructor y duration son obligatorios',
      });
    }

    const result = await pool.query(
      `INSERT INTO "Course" (title, description, instructor, duration, level, "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [title, description, instructor, duration, level]
    );

    res.status(201).json({
      message: 'Curso creado exitosamente',
      course: result.rows[0],
    });
  } catch (error) {
    console.error('Error en createCourse:', error);
    res.status(500).json({ error: 'Error interno al crear el curso' });
  }
};

// ── PUT /api/courses/:id ──────────────────────────────────────────────────────
const updateCourse = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'El ID del curso debe ser un número entero positivo' });
    }

    // Buscar el curso existente
    const existing = await pool.query(
      'SELECT * FROM "Course" WHERE id = $1 LIMIT 1',
      [id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    const current = existing.rows[0];

    // Sanitización (mantiene valor actual si no se envía uno nuevo)
    const title       = typeof req.body.title       === 'string' ? req.body.title.trim()       || current.title       : current.title;
    const description = typeof req.body.description === 'string' ? req.body.description.trim() || current.description : current.description;
    const instructor  = typeof req.body.instructor  === 'string' ? req.body.instructor.trim()  || current.instructor  : current.instructor;
    const duration    = typeof req.body.duration    === 'string' ? req.body.duration.trim()    || current.duration    : current.duration;
    const level       = typeof req.body.level       === 'string' ? req.body.level.trim()       || current.level       : current.level;

    const result = await pool.query(
      `UPDATE "Course"
       SET title       = $1,
           description = $2,
           instructor  = $3,
           duration    = $4,
           level       = $5,
           "updatedAt" = NOW()
       WHERE id = $6
       RETURNING *`,
      [title, description, instructor, duration, level, id]
    );

    res.status(200).json({
      message: 'Curso actualizado exitosamente',
      course: result.rows[0],
    });
  } catch (error) {
    console.error('Error en updateCourse:', error);
    res.status(500).json({ error: 'Error interno al actualizar el curso' });
  }
};

// ── DELETE /api/courses/:id ───────────────────────────────────────────────────
const deleteCourse = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'El ID del curso debe ser un número entero positivo' });
    }

    const result = await pool.query(
      'DELETE FROM "Course" WHERE id = $1 RETURNING id, title',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.status(200).json({
      message: 'Curso eliminado exitosamente',
      deletedCourse: result.rows[0],
    });
  } catch (error) {
    console.error('Error en deleteCourse:', error);
    res.status(500).json({ error: 'Error interno al eliminar el curso' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
