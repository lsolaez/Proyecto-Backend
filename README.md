# Proyecto Backend - Sistema de Biblioteca

API REST desarrollada en Node.js con Express para un sistema de biblioteca donde los usuarios pueden registrarse, iniciar sesión y reservar libros digitalmente.

## Características

- ✅ Sistema de autenticación con JWT
- ✅ Sistema de permisos flexible
- ✅ CRUD completo para Usuarios y Libros
- ✅ Sistema de reservas de libros
- ✅ Filtros y paginación para búsqueda de libros
- ✅ Soft deletes para seguridad
- ✅ Documentación Swagger completa
- ✅ Tests unitarios para todos los controladores

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- PostgreSQL (v12 o superior)

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd Proyecto-Backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```
PORT=3000
API_URL=http://localhost:3000
JWT_SECRET=tu_secret_key_muy_segura_aqui
DB_HOST=localhost
DB_PORT=5432
DB_NAME=biblioteca
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres
DB_SSL=false
NODE_ENV=development
```

4. Crear la base de datos en PostgreSQL:
```sql
CREATE DATABASE biblioteca;
```

## Uso

### Iniciar el servidor

Modo desarrollo (con nodemon):
```bash
npm run dev
```

Modo producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Documentación Swagger

Una vez iniciado el servidor, accede a la documentación interactiva de Swagger en:
```
http://localhost:3000/api-docs
```

## Endpoints Principales

### Usuarios

- `POST /api/usuarios/registro` - Registrar nuevo usuario
- `POST /api/usuarios/login` - Iniciar sesión
- `GET /api/usuarios/:id` - Obtener información de usuario
- `PUT /api/usuarios/:id` - Actualizar usuario (requiere autenticación)
- `DELETE /api/usuarios/:id` - Deshabilitar usuario (requiere autenticación)

### Libros

- `POST /api/libros` - Crear libro (requiere autenticación y permiso `crear_libros`)
- `GET /api/libros` - Listar libros con filtros y paginación
- `GET /api/libros/:id` - Obtener información de un libro
- `PUT /api/libros/:id` - Actualizar libro (requiere autenticación)
- `DELETE /api/libros/:id` - Deshabilitar libro (requiere autenticación y permiso `deshabilitar_libros`)
- `POST /api/libros/reservar` - Reservar un libro (requiere autenticación)

### Reservas

- `GET /api/reservas/libro/:libroId` - Historial de reservas de un libro (requiere autenticación)
- `GET /api/reservas/usuario/:usuarioId` - Historial de reservas de un usuario (requiere autenticación)

## Permisos

El sistema utiliza un sistema de permisos flexible. Los permisos disponibles son:

- `crear_libros` - Permite crear nuevos libros
- `modificar_libros` - Permite modificar información de libros
- `modificar_usuarios` - Permite modificar información de usuarios
- `deshabilitar_libros` - Permite deshabilitar libros
- `deshabilitar_usuarios` - Permite deshabilitar usuarios

Los permisos se pueden combinar de cualquier manera y se almacenan como un array en el campo `permisos` del usuario.

## Autenticación

La mayoría de los endpoints requieren autenticación mediante JWT. Para autenticarte:

1. Realiza login en `/api/usuarios/login`
2. Obtén el token de la respuesta
3. Incluye el token en las peticiones usando el header:
```
Authorization: Bearer <token>
```

## Filtros de Búsqueda de Libros

El endpoint `GET /api/libros` soporta los siguientes filtros como query parameters:

- `genero` - Filtrar por género
- `fechaPublicacion` - Filtrar por fecha de publicación (formato: YYYY-MM-DD)
- `editorial` - Filtrar por editorial
- `autor` - Filtrar por autor (búsqueda parcial)
- `nombre` - Filtrar por nombre (búsqueda parcial)
- `disponible` - Filtrar por disponibilidad (true/false)
- `page` - Número de página (default: 1)
- `limit` - Libros por página (default: 10)
- `includeDisabled` - Incluir registros deshabilitados (true/false, default: false)

Ejemplo:
```
GET /api/libros?genero=Novela&autor=Cervantes&page=1&limit=5
```

## Tests

Ejecutar todos los tests:
```bash
npm test
```

Ejecutar tests en modo watch:
```bash
npm run test:watch
```

Los tests cubren:
- Casos exitosos para todas las operaciones
- Validaciones de entrada
- Manejo de errores
- Autenticación y permisos

## Estructura del Proyecto

```
Proyecto-Backend/
├── src/
│   ├── config/
│   │   ├── database.js      # Configuración de Sequelize
│   │   └── swagger.js        # Configuración de Swagger
│   ├── controllers/
│   │   ├── usuarioController.js
│   │   ├── libroController.js
│   │   └── reservaController.js
│   ├── middleware/
│   │   └── auth.js           # Middleware de autenticación y permisos
│   ├── models/
│   │   ├── Usuario.js
│   │   ├── Libro.js
│   │   ├── Reserva.js
│   │   └── index.js          # Relaciones entre modelos
│   ├── routes/
│   │   ├── usuarioRoutes.js
│   │   ├── libroRoutes.js
│   │   └── reservaRoutes.js
│   ├── tests/
│   │   ├── usuarioController.test.js
│   │   ├── libroController.test.js
│   │   └── reservaController.test.js
│   └── app.js                # Archivo principal
├── .env
├── .gitignore
├── jest.config.js
├── package.json
└── README.md
```

## Base de Datos

El proyecto utiliza PostgreSQL con Sequelize como ORM. 

**Importante:** Debes crear la base de datos manualmente antes de iniciar el servidor:

```sql
CREATE DATABASE biblioteca;
```

Las tablas se crearán automáticamente al iniciar el servidor por primera vez.

## Notas Importantes

- Los soft deletes están implementados: los registros se deshabilitan en lugar de eliminarse
- Por defecto, los endpoints READ excluyen registros deshabilitados a menos que se especifique `includeDisabled=true`
- Cualquier usuario puede reservar libros (no hay límite de reservas)
- Un libro es considerado una unidad única (no hay copias repetidas)

## Licencia

ISC
