const express  = require('express');
const router   = express.Router();
const auth     = require('../middlewares/auth');
const admin    = require('../middlewares/admin');
const { getUsers } = require('../controllers/admin.controller');

// GET /api/admin/users — listar todos los usuarios (solo ADMIN)
router.get('/users', auth, admin, getUsers);

module.exports = router;
