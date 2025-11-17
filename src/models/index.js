const Usuario = require('./Usuario');
const Libro = require('./Libro');
const Reserva = require('./Reserva');

// Definir relaciones
Usuario.hasMany(Reserva, { foreignKey: 'usuarioId', as: 'reservas' });
Libro.hasMany(Reserva, { foreignKey: 'libroId', as: 'reservas' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
Reserva.belongsTo(Libro, { foreignKey: 'libroId', as: 'libro' });

module.exports = {
  Usuario,
  Libro,
  Reserva,
};

