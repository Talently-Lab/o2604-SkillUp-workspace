const express = require('express');
const router = express.Router();
const {
  getCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso
} = require('../controllers/cursoController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', getCursos);
router.get('/:id', getCursoById);

// Rutas protegidas (Solo Admin)
router.post('/', verificarToken, esAdmin, createCurso);
router.put('/:id', verificarToken, esAdmin, updateCurso);
router.delete('/:id', verificarToken, esAdmin, deleteCurso);

module.exports = router;