const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reserva = sequelize.define('Reserva', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id',
    },
  },
  libroId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'libros',
      key: 'id',
    },
  },
  fechaReserva: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  fechaEntrega: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'reservas',
  timestamps: true,
});

module.exports = Reserva;

