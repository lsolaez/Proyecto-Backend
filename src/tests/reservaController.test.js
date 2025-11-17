const request = require('supertest');
const app = require('../app');
const { Reserva, Libro, Usuario } = require('../models');
const sequelize = require('../config/database');

describe('Reserva Controller', () => {
  let token;
  let libroId;
  let usuarioId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Crear usuario
    const usuario = await Usuario.create({
      nombre: 'Usuario Test',
      email: 'test@example.com',
      password: 'password123',
    });
    usuarioId = usuario.id;

    // Crear libro
    const libro = await Libro.create({
      nombre: 'Libro Test',
      autor: 'Autor Test',
      genero: 'Género Test',
      fechaPublicacion: '2020-01-01',
      editorial: 'Editorial Test',
    });
    libroId = libro.id;

    // Crear reserva
    await Reserva.create({
      usuarioId,
      libroId,
      fechaReserva: new Date(),
    });

    const loginResponse = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    token = loginResponse.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/reservas/libro/:libroId', () => {
    it('debe obtener historial de reservas de un libro exitosamente', async () => {
      const response = await request(app)
        .get(`/api/reservas/libro/${libroId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('historial');
      expect(Array.isArray(response.body.historial)).toBe(true);
      if (response.body.historial.length > 0) {
        expect(response.body.historial[0]).toHaveProperty('nombrePersona');
        expect(response.body.historial[0]).toHaveProperty('fechaReserva');
      }
    });

    it('debe fallar cuando el libro no existe', async () => {
      const response = await request(app)
        .get('/api/reservas/libro/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.historial).toEqual([]);
    });
  });

  describe('GET /api/reservas/usuario/:usuarioId', () => {
    it('debe obtener historial de reservas de un usuario exitosamente', async () => {
      const response = await request(app)
        .get(`/api/reservas/usuario/${usuarioId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('historial');
      expect(Array.isArray(response.body.historial)).toBe(true);
      if (response.body.historial.length > 0) {
        expect(response.body.historial[0]).toHaveProperty('nombreLibro');
        expect(response.body.historial[0]).toHaveProperty('fechaReserva');
      }
    });

    it('debe fallar cuando no está autenticado', async () => {
      const response = await request(app)
        .get(`/api/reservas/usuario/${usuarioId}`);

      expect(response.status).toBe(401);
    });
  });
});

