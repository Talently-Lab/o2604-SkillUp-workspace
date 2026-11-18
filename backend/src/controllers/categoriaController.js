const prisma = require('../config/database');

const getCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { id: 'asc' }
    });
    return res.json(categorias);
  } catch (error) {
    console.error('Error en getCategorias:', error);
    return res.status(500).json({ error: 'Error al obtener las categorías.' });
  }
};

const createCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre de la categoría es obligatorio.' });
    }

    const nuevaCategoria = await prisma.categoria.create({
      data: { nombre, descripcion }
    });

    return res.status(201).json(nuevaCategoria);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe una categoría con ese nombre.' });
    }
    console.error('Error en createCategoria:', error);
    return res.status(500).json({ error: 'Error al crear la categoría.' });
  }
};

module.exports = {
  getCategorias,
  createCategoria
};