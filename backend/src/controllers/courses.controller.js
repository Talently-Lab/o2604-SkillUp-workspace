/**
 * courses.controller.js — Capa HTTP de cursos.
 * Solo extrae req.params / req.body, delega en coursesService
 * y serializa la respuesta. Sin pool, sin SQL, sin validaciones.
 */

const coursesService = require('../services/courses.service');

// ── GET /api/courses ──────────────────────────────────────────────────────────
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await coursesService.getAllCourses();
    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/courses/:id ──────────────────────────────────────────────────────
const getCourseById = async (req, res, next) => {
  try {
    const course = await coursesService.getCourseById(req.params.id);
    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/courses ─────────────────────────────────────────────────────────
const createCourse = async (req, res, next) => {
  try {
    const course = await coursesService.createCourse(req.body);
    res.status(201).json({
      message: 'Curso creado exitosamente',
      course,
    });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/courses/:id ──────────────────────────────────────────────────────
const updateCourse = async (req, res, next) => {
  try {
    const course = await coursesService.updateCourse(req.params.id, req.body);
    res.status(200).json({
      message: 'Curso actualizado exitosamente',
      course,
    });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/courses/:id ───────────────────────────────────────────────────
const deleteCourse = async (req, res, next) => {
  try {
    const deletedCourse = await coursesService.deleteCourse(req.params.id);
    res.status(200).json({
      message: 'Curso eliminado exitosamente',
      deletedCourse,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };
