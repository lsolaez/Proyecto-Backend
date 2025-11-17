const request = require('supertest');
const app = require('../app');
const { Libro, Usuario } = require('../models');
const sequelize = require('../config/database');

describe('Libro Controller', () => {
  let token;
  let usuarioId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Crear usuario con permisos para crear libros
    const usuario = await Usuario.create({
      nombre: 'Admin',
      email: 'admin@example.com',
      password: 'password123',
      permisos: ['crear_libros', 'modificar_libros', 'deshabilitar_libros'],
    });
    usuarioId = usuario.id;

    const loginResponse = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'admin@example.com',
        password: 'password123',
      });
    token = loginResponse.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/libros', () => {
    it('debe crear un libro exitosamente', async () => {
      const response = await request(app)
        .post('/api/libros')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nombre: 'El Quijote',
          autor: 'Miguel de Cervantes',
          genero: 'Novela',
          fechaPublicacion: '1605-01-01',
          editorial: 'Editorial Test',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('libro');
      expect(response.body.libro.nombre).toBe('El Quijote');
    });

    it('debe fallar cuando falta el nombre', async () => {
      const response = await request(app)
        .post('/api/libros')
        .set('Authorization', `Bearer ${token}`)
        .send({
          autor: 'Miguel de Cervantes',
          genero: 'Novela',
          fechaPublicacion: '1605-01-01',
          editorial: 'Editorial Test',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('debe fallar cuando la fecha no es válida', async () => {
      const response = await request(app)
        .post('/api/libros')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nombre: 'Test Book',
          autor: 'Test Author',
          genero: 'Test',
          fechaPublicacion: 'fecha-invalida',
          editorial: 'Editorial Test',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/libros', () => {
    beforeEach(async () => {
      await Libro.create({
        nombre: 'Libro 1',
        autor: 'Autor 1',
        genero: 'Género 1',
        fechaPublicacion: '2020-01-01',
        editorial: 'Editorial 1',
      });
      await Libro.create({
        nombre: 'Libro 2',
        autor: 'Autor 2',
        genero: 'Género 2',
        fechaPublicacion: '2021-01-01',
        editorial: 'Editorial 2',
      });
    });

    it('debe obtener libros con paginación exitosamente', async () => {
      const response = await request(app)
        .get('/api/libros?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('libros');
      expect(response.body).toHaveProperty('paginacion');
      expect(response.body.paginacion).toHaveProperty('paginaActual');
      expect(response.body.paginacion).toHaveProperty('paginaMaxima');
    });

    it('debe filtrar libros por género', async () => {
      const response = await request(app)
        .get('/api/libros?genero=Género 1');

      expect(response.status).toBe(200);
      expect(response.body.libros.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/libros/:id', () => {
    let libroId;

    beforeEach(async () => {
      const libro = await Libro.create({
        nombre: 'Libro Test',
        autor: 'Autor Test',
        genero: 'Género Test',
        fechaPublicacion: '2020-01-01',
        editorial: 'Editorial Test',
      });
      libroId = libro.id;
    });

    it('debe obtener un libro exitosamente', async () => {
      const response = await request(app)
        .get(`/api/libros/${libroId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', libroId);
      expect(response.body.nombre).toBe('Libro Test');
    });

    it('debe fallar cuando el libro no existe', async () => {
      const response = await request(app)
        .get('/api/libros/99999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/libros/:id', () => {
    let libroId;

    beforeEach(async () => {
      const libro = await Libro.create({
        nombre: 'Libro Update',
        autor: 'Autor Update',
        genero: 'Género Update',
        fechaPublicacion: '2020-01-01',
        editorial: 'Editorial Update',
      });
      libroId = libro.id;
    });

    it('debe actualizar libro exitosamente', async () => {
      const response = await request(app)
        .put(`/api/libros/${libroId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          nombre: 'Libro Actualizado',
        });

      expect(response.status).toBe(200);
      expect(response.body.libro.nombre).toBe('Libro Actualizado');
    });

    it('debe fallar cuando la fecha no es válida', async () => {
      const response = await request(app)
        .put(`/api/libros/${libroId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          fechaPublicacion: 'fecha-invalida',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('DELETE /api/libros/:id', () => {
    let libroId;

    beforeEach(async () => {
      const libro = await Libro.create({
        nombre: 'Libro Delete',
        autor: 'Autor Delete',
        genero: 'Género Delete',
        fechaPublicacion: '2020-01-01',
        editorial: 'Editorial Delete',
      });
      libroId = libro.id;
    });

    it('debe deshabilitar libro exitosamente', async () => {
      const response = await request(app)
        .delete(`/api/libros/${libroId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      
      const libro = await Libro.findByPk(libroId);
      expect(libro.activo).toBe(false);
    });
  });

  describe('POST /api/libros/reservar', () => {
    let libroId;
    let usuarioToken;

    beforeEach(async () => {
      const libro = await Libro.create({
        nombre: 'Libro Reserva',
        autor: 'Autor Reserva',
        genero: 'Género Reserva',
        fechaPublicacion: '2020-01-01',
        editorial: 'Editorial Reserva',
        disponible: true,
      });
      libroId = libro.id;

      const usuario = await Usuario.create({
        nombre: 'Usuario Reserva',
        email: 'reserva@example.com',
        password: 'password123',
      });

      const loginResponse = await request(app)
        .post('/api/usuarios/login')
        .send({
          email: 'reserva@example.com',
          password: 'password123',
        });
      usuarioToken = loginResponse.body.token;
    });

    it('debe reservar libro exitosamente', async () => {
      const response = await request(app)
        .post('/api/libros/reservar')
        .set('Authorization', `Bearer ${usuarioToken}`)
        .send({
          libroId,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('reserva');
    });
  });
});

