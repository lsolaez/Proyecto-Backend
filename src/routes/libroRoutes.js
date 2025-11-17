const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const libroController = require('../controllers/libroController');
const { authenticate, hasPermission } = require('../middleware/auth');

// Validaciones
const validarCrearLibro = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('autor').notEmpty().withMessage('El autor es requerido'),
  body('genero').notEmpty().withMessage('El género es requerido'),
  body('fechaPublicacion').isISO8601().withMessage('La fecha de publicación debe ser válida'),
  body('editorial').notEmpty().withMessage('La editorial es requerida'),
];

const validarActualizarLibro = [
  body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('autor').optional().notEmpty().withMessage('El autor no puede estar vacío'),
  body('genero').optional().notEmpty().withMessage('El género no puede estar vacío'),
  body('fechaPublicacion').optional().isISO8601().withMessage('La fecha de publicación debe ser válida'),
  body('editorial').optional().notEmpty().withMessage('La editorial no puede estar vacía'),
  body('disponible').optional().isBoolean().withMessage('Disponible debe ser un booleano'),
];

/**
 * @swagger
 * /api/libros:
 *   post:
 *     summary: Crear un nuevo libro
 *     tags: [Libros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - autor
 *               - genero
 *               - fechaPublicacion
 *               - editorial
 *             properties:
 *               nombre:
 *                 type: string
 *               autor:
 *                 type: string
 *               genero:
 *                 type: string
 *               fechaPublicacion:
 *                 type: string
 *                 format: date
 *               editorial:
 *                 type: string
 *     responses:
 *       201:
 *         description: Libro creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */
router.post('/', authenticate, hasPermission('crear_libros'), validarCrearLibro, libroController.crearLibro);

/**
 * @swagger
 * /api/libros:
 *   get:
 *     summary: Obtener múltiples libros con filtros y paginación
 *     tags: [Libros]
 *     parameters:
 *       - in: query
 *         name: genero
 *         schema:
 *           type: string
 *       - in: query
 *         name: fechaPublicacion
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: editorial
 *         schema:
 *           type: string
 *       - in: query
 *         name: autor
 *         schema:
 *           type: string
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *       - in: query
 *         name: disponible
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: includeDisabled
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de libros con paginación
 */
router.get('/', libroController.obtenerLibros);

/**
 * @swagger
 * /api/libros/{id}:
 *   get:
 *     summary: Obtener información de un libro
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: includeDisabled
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Información del libro
 *       404:
 *         description: Libro no encontrado
 */
router.get('/:id', libroController.obtenerLibro);

/**
 * @swagger
 * /api/libros/{id}:
 *   put:
 *     summary: Actualizar información de un libro
 *     tags: [Libros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               autor:
 *                 type: string
 *               genero:
 *                 type: string
 *               fechaPublicacion:
 *                 type: string
 *                 format: date
 *               editorial:
 *                 type: string
 *               disponible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Libro actualizado exitosamente
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Libro no encontrado
 */
router.put('/:id', authenticate, validarActualizarLibro, libroController.actualizarLibro);

/**
 * @swagger
 * /api/libros/{id}:
 *   delete:
 *     summary: Deshabilitar un libro (soft delete)
 *     tags: [Libros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Libro deshabilitado exitosamente
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Libro no encontrado
 */
router.delete('/:id', authenticate, hasPermission('deshabilitar_libros'), libroController.deshabilitarLibro);

/**
 * @swagger
 * /api/libros/reservar:
 *   post:
 *     summary: Reservar un libro
 *     tags: [Libros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libroId
 *             properties:
 *               libroId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Libro reservado exitosamente
 *       400:
 *         description: Libro no disponible
 *       404:
 *         description: Libro no encontrado
 */
router.post('/reservar', authenticate, libroController.reservarLibro);

module.exports = router;

