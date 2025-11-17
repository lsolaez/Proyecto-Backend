const { Libro, Reserva, Usuario } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// CREATE - Crear libro
const crearLibro = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, autor, genero, fechaPublicacion, editorial } = req.body;

    const libro = await Libro.create({
      nombre,
      autor,
      genero,
      fechaPublicacion,
      editorial,
      disponible: true,
    });

    res.status(201).json({
      message: 'Libro creado exitosamente',
      libro,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Obtener un libro
const obtenerLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const includeDisabled = req.query.includeDisabled === 'true';

    const where = { id: parseInt(id) };
    if (!includeDisabled) {
      where.activo = true;
    }

    const libro = await Libro.findOne({ where });

    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json(libro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Obtener múltiples libros con filtros y paginación
const obtenerLibros = async (req, res) => {
  try {
    const {
      genero,
      fechaPublicacion,
      editorial,
      autor,
      nombre,
      disponible,
      page = 1,
      limit = 10,
      includeDisabled = 'false',
    } = req.query;

    const where = {};
    
    if (!includeDisabled || includeDisabled === 'false') {
      where.activo = true;
    }

    if (genero) where.genero = genero;
    if (editorial) where.editorial = editorial;
    if (autor) where.autor = { [Op.like]: `%${autor}%` };
    if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
    if (disponible !== undefined) where.disponible = disponible === 'true';
    if (fechaPublicacion) {
      const fecha = new Date(fechaPublicacion);
      where.fechaPublicacion = {
        [Op.gte]: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()),
        [Op.lt]: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + 1),
      };
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Máximo 100 por página
    const offset = (pageNum - 1) * limitNum;

    const { count, rows } = await Libro.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      attributes: ['id', 'nombre'],
      order: [['nombre', 'ASC']],
    });

    const totalPages = Math.max(1, Math.ceil(count / limitNum));

    res.json({
      libros: rows,
      paginacion: {
        paginaActual: pageNum,
        paginaMaxima: totalPages,
        librosPorPagina: limitNum,
        totalLibros: count,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE - Actualizar libro
const actualizarLibro = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { nombre, autor, genero, fechaPublicacion, editorial, disponible } = req.body;

    const libro = await Libro.findByPk(id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    // Verificar si se están modificando campos de información del libro
    const camposInformacion = ['nombre', 'autor', 'genero', 'fechaPublicacion', 'editorial'];
    const seModificanCampos = camposInformacion.some(campo => req.body[campo] !== undefined);

    if (seModificanCampos && !req.usuario.permisos.includes('modificar_libros')) {
      return res.status(403).json({ error: 'No tienes permisos para modificar la información del libro' });
    }

    const datosActualizar = {};
    if (nombre !== undefined) datosActualizar.nombre = nombre;
    if (autor !== undefined) datosActualizar.autor = autor;
    if (genero !== undefined) datosActualizar.genero = genero;
    if (fechaPublicacion !== undefined) datosActualizar.fechaPublicacion = fechaPublicacion;
    if (editorial !== undefined) datosActualizar.editorial = editorial;
    if (disponible !== undefined) datosActualizar.disponible = disponible;

    await libro.update(datosActualizar);

    res.json({
      message: 'Libro actualizado exitosamente',
      libro,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE - Deshabilitar libro (soft delete)
const deshabilitarLibro = async (req, res) => {
  try {
    const { id } = req.params;

    const libro = await Libro.findByPk(id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    await libro.update({ activo: false, disponible: false });

    res.json({ message: 'Libro deshabilitado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reservar libro
const reservarLibro = async (req, res) => {
  try {
    const { libroId } = req.body;
    const usuarioId = req.usuario.id;

    const libro = await Libro.findOne({ where: { id: libroId, activo: true } });
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    if (!libro.disponible) {
      return res.status(400).json({ error: 'El libro no está disponible' });
    }

    const reserva = await Reserva.create({
      usuarioId,
      libroId,
      fechaReserva: new Date(),
    });

    await libro.update({ disponible: false });

    res.status(201).json({
      message: 'Libro reservado exitosamente',
      reserva,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearLibro,
  obtenerLibro,
  obtenerLibros,
  actualizarLibro,
  deshabilitarLibro,
  reservarLibro,
};

