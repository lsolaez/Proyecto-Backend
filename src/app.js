const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { swaggerUi, specs } = require('./config/swagger');
const usuarioRoutes = require('./routes/usuarioRoutes');
const libroRoutes = require('./routes/libroRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
}));

// Routes
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/libros', libroRoutes);
app.use('/api/reservas', reservaRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicializar base de datos y servidor
const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados correctamente.');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};
if (require.main === module)  {
  iniciarServidor();
}

module.exports = app;

