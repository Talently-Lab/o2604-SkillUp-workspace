const prisma = require('../config/database');

const NIVELES_VALIDOS = ['Principiante', 'Intermedio', 'Avanzado'];

// GET /api/cursos (Público - soporta filtros ?categoriaId=1&nivel=Principiante&buscar=react)
const getCursos = async (req, res) => {
  try {
    const { categoriaId, nivel, buscar } = req.query;

    const filtros = {
      publicado: true
    };

    if (categoriaId) {
      filtros.categoriaId = Number(categoriaId);
    }

    if (nivel && NIVELES_VALIDOS.includes(nivel)) {
      filtros.nivel = nivel;
    }

    if (buscar) {
      filtros.OR = [
        { titulo: { contains: buscar, mode: 'insensitive' } },
        { descripcion: { contains: buscar, mode: 'insensitive' } }
      ];
    }

    const cursos = await prisma.curso.findMany({
      where: filtros,
      include: {
        categoria: {
          select: { id: true, nombre: true }
        }
      },
      orderBy: { creadoEn: 'desc' }
    });

    return res.json(cursos);
  } catch (error) {
    console.error('Error en getCursos:', error);
    return res.status(500).json({ error: 'Error al obtener el catálogo de cursos.' });
  }
};

// GET /api/cursos/:id (Público - incluye categoría y listado de clases ordenadas)
const getCursoById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de curso inválido.' });
    }

    const curso = await prisma.curso.findUnique({
      where: { id },
      include: {
        categoria: {
          select: { id: true, nombre: true }
        },
        clases: {
          orderBy: { orden: 'asc' },
          select: {
            id: true,
            titulo: true,
            descripcion: true,
            orden: true
          }
        }
      }
    });

    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado.' });
    }

    return res.json(curso);
  } catch (error) {
    console.error('Error en getCursoById:', error);
    return res.status(500).json({ error: 'Error al obtener el detalle del curso.' });
  }
};

// POST /api/cursos (Solo Admin)
const createCurso = async (req, res) => {
  try {
    const {
      categoriaId,
      titulo,
      descripcion,
      resultado,
      nivel,
      instructor,
      duracion,
      imagenUrl,
      publicado
    } = req.body;

    if (!categoriaId || !titulo || !descripcion || !instructor || !duracion) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios (categoriaId, titulo, descripcion, instructor, duracion).'
      });
    }

    if (nivel && !NIVELES_VALIDOS.includes(nivel)) {
      return res.status(400).json({
        error: `Nivel inválido. Valores permitidos: ${NIVELES_VALIDOS.join(', ')}`
      });
    }

    const categoriaExiste = await prisma.categoria.findUnique({
      where: { id: Number(categoriaId) }
    });

    if (!categoriaExiste) {
      return res.status(404).json({ error: 'La categoría indicada no existe.' });
    }

    const nuevoCurso = await prisma.curso.create({
      data: {
        categoriaId: Number(categoriaId),
        titulo,
        descripcion,
        resultado: resultado || null,
        nivel: nivel || 'Principiante',
        instructor,
        duracion,
        imagenUrl: imagenUrl || null,
        publicado: publicado !== undefined ? Boolean(publicado) : true
      },
      include: {
        categoria: {
          select: { id: true, nombre: true }
        }
      }
    });

    return res.status(201).json(nuevoCurso);
  } catch (error) {
    console.error('Error en createCurso:', error);
    return res.status(500).json({ error: 'Error interno al crear el curso.' });
  }
};

// PUT /api/cursos/:id (Solo Admin)
const updateCurso = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de curso inválido.' });
    }

    const cursoExistente = await prisma.curso.findUnique({ where: { id } });
    if (!cursoExistente) {
      return res.status(404).json({ error: 'Curso no encontrado.' });
    }

    const {
      categoriaId,
      titulo,
      descripcion,
      resultado,
      nivel,
      instructor,
      duracion,
      imagenUrl,
      publicado
    } = req.body;

    if (nivel && !NIVELES_VALIDOS.includes(nivel)) {
      return res.status(400).json({
        error: `Nivel inválido. Valores permitidos: ${NIVELES_VALIDOS.join(', ')}`
      });
    }

    const cursoActualizado = await prisma.curso.update({
      where: { id },
      data: {
        ...(categoriaId !== undefined && { categoriaId: Number(categoriaId) }),
        ...(titulo !== undefined && { titulo }),
        ...(descripcion !== undefined && { descripcion }),
        ...(resultado !== undefined && { resultado }),
        ...(nivel !== undefined && { nivel }),
        ...(instructor !== undefined && { instructor }),
        ...(duracion !== undefined && { duracion }),
        ...(imagenUrl !== undefined && { imagenUrl }),
        ...(publicado !== undefined && { publicado: Boolean(publicado) })
      },
      include: {
        categoria: {
          select: { id: true, nombre: true }
        }
      }
    });

    return res.json(cursoActualizado);
  } catch (error) {
    console.error('Error en updateCurso:', error);
    return res.status(500).json({ error: 'Error interno al actualizar el curso.' });
  }
};

// DELETE /api/cursos/:id (Solo Admin)
const deleteCurso = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de curso inválido.' });
    }

    const cursoExistente = await prisma.curso.findUnique({ where: { id } });
    if (!cursoExistente) {
      return res.status(404).json({ error: 'Curso no encontrado.' });
    }

    await prisma.curso.delete({ where: { id } });

    return res.json({ message: 'Curso eliminado correctamente.' });
  } catch (error) {
    console.error('Error en deleteCurso:', error);
    return res.status(500).json({ error: 'Error interno al eliminar el curso.' });
  }
};

module.exports = {
  getCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso
};