const express  = require('express');
const router   = express.Router();
const auth     = require('../middlewares/auth');
const { enroll, getMyEnrollments } = require('../controllers/enrollments.controller');

// POST /api/enrollments — inscribir al usuario autenticado en un curso
router.post('/',   auth, enroll);

// GET  /api/enrollments/me — obtener las inscripciones propias
router.get('/me',  auth, getMyEnrollments);

module.exports = router;
