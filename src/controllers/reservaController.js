const { Reserva, Libro, Usuario } = require('../models');

// Historial de reservas de un libro
const historialLibro = async (req, res) => {
  try {
    const { libroId } = req.params;
    const includeDisabled = req.query.includeDisabled === 'true';

    const where = { libroId: parseInt(libroId) };
    
    const reservas = await Reserva.findAll({
      where,
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre'],
          where: includeDisabled ? {} : { activo: true },
          required: false,
        },
      ],
      order: [['fechaReserva', 'DESC']],
    });

    const historial = reservas.map(reserva => ({
      nombrePersona: reserva.usuario ? reserva.usuario.nombre : 'Usuario eliminado',
      fechaReserva: reserva.fechaReserva,
      fechaEntrega: reserva.fechaEntrega,
    }));

    res.json({
      libroId: parseInt(libroId),
      historial,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Historial de reservas de un usuario
const historialUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const includeDisabled = req.query.includeDisabled === 'true';

    const where = { usuarioId: parseInt(usuarioId) };
    
    const reservas = await Reserva.findAll({
      where,
      include: [
        {
          model: Libro,
          as: 'libro',
          attributes: ['id', 'nombre'],
          where: includeDisabled ? {} : { activo: true },
          required: false,
        },
      ],
      order: [['fechaReserva', 'DESC']],
    });

    const historial = reservas.map(reserva => ({
      nombreLibro: reserva.libro ? reserva.libro.nombre : 'Libro eliminado',
      fechaReserva: reserva.fechaReserva,
      fechaEntrega: reserva.fechaEntrega,
    }));

    res.json({
      usuarioId: parseInt(usuarioId),
      historial,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  historialLibro,
  historialUsuario,
};

