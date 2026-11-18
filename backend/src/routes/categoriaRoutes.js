const express = require('express');
const router = express.Router();
const { getCategorias, createCategoria } = require('../controllers/categoriaController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/', getCategorias);
router.post('/', verificarToken, esAdmin, createCategoria);

module.exports = router;