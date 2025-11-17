const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '24h' }
  );
};

// CREATE - Registro de usuario
const registrarUsuario = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, email, password, permisos } = req.body;

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      permisos: permisos || [],
    });

    const token = generarToken(usuario);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        permisos: usuario.permisos,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Login
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!usuario.activo) {
      return res.status(401).json({ error: 'Usuario deshabilitado' });
    }

    const passwordValido = await usuario.validarPassword(password);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario);

    res.json({
      message: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        permisos: usuario.permisos,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Obtener información del usuario
const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const includeDisabled = req.query.includeDisabled === 'true';

    const where = { id: parseInt(id) };
    if (!includeDisabled) {
      where.activo = true;
    }

    const usuario = await Usuario.findOne({
      where,
      attributes: { exclude: ['password'] },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE - Actualizar usuario
const actualizarUsuario = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { nombre, email, password, permisos } = req.body;
    const usuarioAutenticado = req.usuario;

    // Verificar permisos: solo el mismo usuario o alguien con permiso de modificar usuarios
    if (parseInt(id) !== usuarioAutenticado.id && 
        !usuarioAutenticado.permisos.includes('modificar_usuarios')) {
      return res.status(403).json({ error: 'No tienes permisos para modificar este usuario' });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre;
    if (email) datosActualizar.email = email;
    if (password) datosActualizar.password = password;
    if (permisos !== undefined && usuarioAutenticado.permisos.includes('modificar_usuarios')) {
      datosActualizar.permisos = permisos;
    }

    await usuario.update(datosActualizar);

    const usuarioActualizado = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    res.json({
      message: 'Usuario actualizado exitosamente',
      usuario: usuarioActualizado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE - Deshabilitar usuario (soft delete)
const deshabilitarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioAutenticado = req.usuario;

    // Verificar permisos: solo el mismo usuario o alguien con permiso de deshabilitar usuarios
    if (parseInt(id) !== usuarioAutenticado.id && 
        !usuarioAutenticado.permisos.includes('deshabilitar_usuarios')) {
      return res.status(403).json({ error: 'No tienes permisos para deshabilitar este usuario' });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.update({ activo: false });

    res.json({ message: 'Usuario deshabilitado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registrarUsuario,
  login,
  obtenerUsuario,
  actualizarUsuario,
  deshabilitarUsuario,
};

