const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token de autenticación requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: 'Usuario no válido o deshabilitado' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

const hasPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const usuarioPermisos = req.usuario.permisos || [];
    const hasAnyPermission = permissions.some(perm => usuarioPermisos.includes(perm));

    if (!hasAnyPermission) {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
    }

    next();
  };
};

module.exports = {
  authenticate,
  hasPermission,
};

