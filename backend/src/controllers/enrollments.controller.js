/**
 * enrollments.controller.js — Capa HTTP de inscripciones.
 * Solo extrae req.user / req.body, delega en enrollmentsService
 * y serializa la respuesta. Sin pool, sin SQL, sin validaciones.
 */

const enrollmentsService = require('../services/enrollments.service');

// ── POST /api/enrollments ─────────────────────────────────────────────────────
const enroll = async (req, res, next) => {
  try {
    // userId viene del token JWT decodificado por el middleware auth
    const enrollment = await enrollmentsService.enrollUser({
      userId:      req.user.id,
      rawCourseId: req.body.courseId,
    });

    res.status(201).json({
      message:    'Inscripción realizada con éxito',
      enrollment,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/enrollments/me ───────────────────────────────────────────────────
const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await enrollmentsService.getUserEnrollments(req.user.id);
    res.status(200).json(enrollments);
  } catch (err) {
    next(err);
  }
};

module.exports = { enroll, getMyEnrollments };
