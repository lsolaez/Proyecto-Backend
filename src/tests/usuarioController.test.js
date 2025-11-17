const request = require('supertest');
const app = require('../app');
const { Usuario } = require('../models');
const sequelize = require('../config/database');

describe('Usuario Controller', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/usuarios/registro', () => {
    it('debe registrar un usuario exitosamente', async () => {
      const response = await request(app)
        .post('/api/usuarios/registro')
        .send({
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('usuario');
      expect(response.body.usuario).toHaveProperty('id');
      expect(response.body.usuario.email).toBe('juan@example.com');
      expect(response.body).toHaveProperty('token');
    });

    it('debe fallar cuando falta el nombre', async () => {
      const response = await request(app)
        .post('/api/usuarios/registro')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('debe fallar cuando el email no es válido', async () => {
      const response = await request(app)
        .post('/api/usuarios/registro')
        .send({
          nombre: 'Test User',
          email: 'email-invalido',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('debe fallar cuando la contraseña es muy corta', async () => {
      const response = await request(app)
        .post('/api/usuarios/registro')
        .send({
          nombre: 'Test User',
          email: 'test@example.com',
          password: '123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/usuarios/login', () => {
    beforeEach(async () => {
      await Usuario.create({
        nombre: 'Usuario Test',
        email: 'login@example.com',
        password: 'password123',
      });
    });

    it('debe hacer login exitosamente', async () => {
      const response = await request(app)
        .post('/api/usuarios/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('usuario');
    });

    it('debe fallar con credenciales incorrectas', async () => {
      const response = await request(app)
        .post('/api/usuarios/login')
        .send({
          email: 'login@example.com',
          password: 'password-incorrecta',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('debe fallar cuando falta el email', async () => {
      const response = await request(app)
        .post('/api/usuarios/login')
        .send({
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/usuarios/:id', () => {
    let usuarioId;

    beforeEach(async () => {
      const usuario = await Usuario.create({
        nombre: 'Usuario Get',
        email: 'get@example.com',
        password: 'password123',
      });
      usuarioId = usuario.id;
    });

    it('debe obtener información del usuario exitosamente', async () => {
      const response = await request(app)
        .get(`/api/usuarios/${usuarioId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', usuarioId);
      expect(response.body).not.toHaveProperty('password');
    });

    it('debe fallar cuando el usuario no existe', async () => {
      const response = await request(app)
        .get('/api/usuarios/99999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/usuarios/:id', () => {
    let usuarioId;
    let token;

    beforeEach(async () => {
      const usuario = await Usuario.create({
        nombre: 'Usuario Update',
        email: 'update@example.com',
        password: 'password123',
      });
      usuarioId = usuario.id;

      const loginResponse = await request(app)
        .post('/api/usuarios/login')
        .send({
          email: 'update@example.com',
          password: 'password123',
        });
      token = loginResponse.body.token;
    });

    it('debe actualizar usuario exitosamente', async () => {
      const response = await request(app)
        .put(`/api/usuarios/${usuarioId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          nombre: 'Nombre Actualizado',
        });

      expect(response.status).toBe(200);
      expect(response.body.usuario.nombre).toBe('Nombre Actualizado');
    });

    it('debe fallar cuando el email no es válido', async () => {
      const response = await request(app)
        .put(`/api/usuarios/${usuarioId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'email-invalido',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('DELETE /api/usuarios/:id', () => {
    let usuarioId;
    let token;

    beforeEach(async () => {
      const usuario = await Usuario.create({
        nombre: 'Usuario Delete',
        email: 'delete@example.com',
        password: 'password123',
      });
      usuarioId = usuario.id;

      const loginResponse = await request(app)
        .post('/api/usuarios/login')
        .send({
          email: 'delete@example.com',
          password: 'password123',
        });
      token = loginResponse.body.token;
    });

    it('debe deshabilitar usuario exitosamente', async () => {
      const response = await request(app)
        .delete(`/api/usuarios/${usuarioId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      
      const usuario = await Usuario.findByPk(usuarioId);
      expect(usuario.activo).toBe(false);
    });
  });
});

