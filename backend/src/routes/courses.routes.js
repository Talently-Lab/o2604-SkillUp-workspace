const express = require('express');
const router = express.Router();
const auth  = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses.controller');

// Rutas Públicas
router.get('/',    getAllCourses);
router.get('/:id', getCourseById);

// Rutas Protegidas (Token JWT válido + Rol ADMIN)
router.post('/',      auth, admin, createCourse);
router.put('/:id',    auth, admin, updateCourse);
router.delete('/:id', auth, admin, deleteCourse);

module.exports = router;
