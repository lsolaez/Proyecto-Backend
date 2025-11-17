const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/reservas/libro/{libroId}:
 *   get:
 *     summary: Obtener historial de reservas de un libro
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: libroId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: includeDisabled
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Historial de reservas del libro
 */
router.get('/libro/:libroId', authenticate, reservaController.historialLibro);

/**
 * @swagger
 * /api/reservas/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener historial de reservas de un usuario
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: includeDisabled
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Historial de reservas del usuario
 */
router.get('/usuario/:usuarioId', authenticate, reservaController.historialUsuario);

module.exports = router;

