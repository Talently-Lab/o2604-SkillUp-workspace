const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    message: 'Ruta protegida accesible',
    usuario: req.usuario
  });
});

module.exports = router;