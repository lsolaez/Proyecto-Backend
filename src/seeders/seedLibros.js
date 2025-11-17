const { Libro, Usuario } = require('../models');
const sequelize = require('../config/database');

const librosEjemplo = [
  {
    nombre: 'El Quijote de la Mancha',
    autor: 'Miguel de Cervantes',
    genero: 'Novela',
    fechaPublicacion: new Date('1605-01-01'),
    editorial: 'Francisco de Robles',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    genero: 'Realismo mágico',
    fechaPublicacion: new Date('1967-05-30'),
    editorial: 'Sudamericana',
    disponible: true,
    activo: true,
  },
  {
    nombre: '1984',
    autor: 'George Orwell',
    genero: 'Ciencia ficción',
    fechaPublicacion: new Date('1949-06-08'),
    editorial: 'Secker & Warburg',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El señor de los anillos',
    autor: 'J.R.R. Tolkien',
    genero: 'Fantasía',
    fechaPublicacion: new Date('1954-07-29'),
    editorial: 'Allen & Unwin',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Don Juan Tenorio',
    autor: 'José Zorrilla',
    genero: 'Drama',
    fechaPublicacion: new Date('1844-03-28'),
    editorial: 'Imprenta de D. Vicente de Lalama',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'La Odisea',
    autor: 'Homero',
    genero: 'Épica',
    fechaPublicacion: new Date('-800-01-01'),
    editorial: 'Antigua Grecia',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Romeo y Julieta',
    autor: 'William Shakespeare',
    genero: 'Tragedia',
    fechaPublicacion: new Date('1597-01-01'),
    editorial: 'John Danter',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El código Da Vinci',
    autor: 'Dan Brown',
    genero: 'Thriller',
    fechaPublicacion: new Date('2003-03-18'),
    editorial: 'Doubleday',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Harry Potter y la piedra filosofal',
    autor: 'J.K. Rowling',
    genero: 'Fantasía',
    fechaPublicacion: new Date('1997-06-26'),
    editorial: 'Bloomsbury',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El principito',
    autor: 'Antoine de Saint-Exupéry',
    genero: 'Literatura infantil',
    fechaPublicacion: new Date('1943-04-06'),
    editorial: 'Reynal & Hitchcock',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Crónica de una muerte anunciada',
    autor: 'Gabriel García Márquez',
    genero: 'Realismo mágico',
    fechaPublicacion: new Date('1981-01-01'),
    editorial: 'La Oveja Negra',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El amor en los tiempos del cólera',
    autor: 'Gabriel García Márquez',
    genero: 'Realismo mágico',
    fechaPublicacion: new Date('1985-01-01'),
    editorial: 'Oveja Negra',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Rebelión en la granja',
    autor: 'George Orwell',
    genero: 'Sátira',
    fechaPublicacion: new Date('1945-08-17'),
    editorial: 'Secker & Warburg',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El hobbit',
    autor: 'J.R.R. Tolkien',
    genero: 'Fantasía',
    fechaPublicacion: new Date('1937-09-21'),
    editorial: 'Allen & Unwin',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El Silmarillion',
    autor: 'J.R.R. Tolkien',
    genero: 'Fantasía',
    fechaPublicacion: new Date('1977-09-15'),
    editorial: 'Allen & Unwin',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Hamlet',
    autor: 'William Shakespeare',
    genero: 'Tragedia',
    fechaPublicacion: new Date('1603-01-01'),
    editorial: 'Nicolas Ling y John Trundell',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Macbeth',
    autor: 'William Shakespeare',
    genero: 'Tragedia',
    fechaPublicacion: new Date('1623-01-01'),
    editorial: 'Edward Blount y William Jaggard',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'La Ilíada',
    autor: 'Homero',
    genero: 'Épica',
    fechaPublicacion: new Date('-800-01-01'),
    editorial: 'Antigua Grecia',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'La divina comedia',
    autor: 'Dante Alighieri',
    genero: 'Épica',
    fechaPublicacion: new Date('1320-01-01'),
    editorial: 'Manuscrito',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Los miserables',
    autor: 'Victor Hugo',
    genero: 'Novela',
    fechaPublicacion: new Date('1862-01-01'),
    editorial: 'A. Lacroix, Verboeckhoven & Cie',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El conde de Montecristo',
    autor: 'Alexandre Dumas',
    genero: 'Aventura',
    fechaPublicacion: new Date('1844-01-01'),
    editorial: 'Pétion',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Los tres mosqueteros',
    autor: 'Alexandre Dumas',
    genero: 'Aventura',
    fechaPublicacion: new Date('1844-03-14'),
    editorial: 'Baudry',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Drácula',
    autor: 'Bram Stoker',
    genero: 'Terror',
    fechaPublicacion: new Date('1897-05-26'),
    editorial: 'Archibald Constable and Company',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Frankenstein',
    autor: 'Mary Shelley',
    genero: 'Terror',
    fechaPublicacion: new Date('1818-01-01'),
    editorial: 'Lackington, Hughes, Harding, Mavor & Jones',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Orgullo y prejuicio',
    autor: 'Jane Austen',
    genero: 'Romance',
    fechaPublicacion: new Date('1813-01-28'),
    editorial: 'T. Egerton',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Cumbres borrascosas',
    autor: 'Emily Brontë',
    genero: 'Romance',
    fechaPublicacion: new Date('1847-12-01'),
    editorial: 'Thomas Cautley Newby',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El retrato de Dorian Gray',
    autor: 'Oscar Wilde',
    genero: 'Filosófico',
    fechaPublicacion: new Date('1890-07-01'),
    editorial: 'Ward, Lock and Company',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El gran Gatsby',
    autor: 'F. Scott Fitzgerald',
    genero: 'Novela',
    fechaPublicacion: new Date('1925-04-10'),
    editorial: 'Charles Scribner\'s Sons',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Matar a un ruiseñor',
    autor: 'Harper Lee',
    genero: 'Novela',
    fechaPublicacion: new Date('1960-07-11'),
    editorial: 'J. B. Lippincott & Co.',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El guardián entre el centeno',
    autor: 'J.D. Salinger',
    genero: 'Novela',
    fechaPublicacion: new Date('1951-07-16'),
    editorial: 'Little, Brown and Company',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Las aventuras de Tom Sawyer',
    autor: 'Mark Twain',
    genero: 'Aventura',
    fechaPublicacion: new Date('1876-12-01'),
    editorial: 'American Publishing Company',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Las aventuras de Huckleberry Finn',
    autor: 'Mark Twain',
    genero: 'Aventura',
    fechaPublicacion: new Date('1884-12-10'),
    editorial: 'Chatto & Windus',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Moby Dick',
    autor: 'Herman Melville',
    genero: 'Aventura',
    fechaPublicacion: new Date('1851-10-18'),
    editorial: 'Richard Bentley',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El proceso',
    autor: 'Franz Kafka',
    genero: 'Filosófico',
    fechaPublicacion: new Date('1925-01-01'),
    editorial: 'Verlag Die Schmiede',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'La metamorfosis',
    autor: 'Franz Kafka',
    genero: 'Filosófico',
    fechaPublicacion: new Date('1915-10-01'),
    editorial: 'Kurt Wolff Verlag',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Crimen y castigo',
    autor: 'Fiódor Dostoyevski',
    genero: 'Filosófico',
    fechaPublicacion: new Date('1866-01-01'),
    editorial: 'The Russian Messenger',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Los hermanos Karamazov',
    autor: 'Fiódor Dostoyevski',
    genero: 'Filosófico',
    fechaPublicacion: new Date('1880-01-01'),
    editorial: 'The Russian Messenger',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Guerra y paz',
    autor: 'León Tolstói',
    genero: 'Novela histórica',
    fechaPublicacion: new Date('1869-01-01'),
    editorial: 'The Russian Messenger',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Ana Karenina',
    autor: 'León Tolstói',
    genero: 'Novela',
    fechaPublicacion: new Date('1877-01-01'),
    editorial: 'The Russian Messenger',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El nombre de la rosa',
    autor: 'Umberto Eco',
    genero: 'Misterio',
    fechaPublicacion: new Date('1980-01-01'),
    editorial: 'Bompiani',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Rayuela',
    autor: 'Julio Cortázar',
    genero: 'Novela experimental',
    fechaPublicacion: new Date('1963-06-28'),
    editorial: 'Sudamericana',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Ficciones',
    autor: 'Jorge Luis Borges',
    genero: 'Cuento',
    fechaPublicacion: new Date('1944-01-01'),
    editorial: 'Sur',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Pedro Páramo',
    autor: 'Juan Rulfo',
    genero: 'Realismo mágico',
    fechaPublicacion: new Date('1955-01-01'),
    editorial: 'Fondo de Cultura Económica',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'La casa de los espíritus',
    autor: 'Isabel Allende',
    genero: 'Realismo mágico',
    fechaPublicacion: new Date('1982-01-01'),
    editorial: 'Plaza & Janés',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El túnel',
    autor: 'Ernesto Sabato',
    genero: 'Novela psicológica',
    fechaPublicacion: new Date('1948-01-01'),
    editorial: 'Sur',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Sobre héroes y tumbas',
    autor: 'Ernesto Sabato',
    genero: 'Novela',
    fechaPublicacion: new Date('1961-01-01'),
    editorial: 'Fabril Editora',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El aleph',
    autor: 'Jorge Luis Borges',
    genero: 'Cuento',
    fechaPublicacion: new Date('1949-01-01'),
    editorial: 'Losada',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El laberinto de los espíritus',
    autor: 'Carlos Ruiz Zafón',
    genero: 'Misterio',
    fechaPublicacion: new Date('2016-11-17'),
    editorial: 'Planeta',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'La sombra del viento',
    autor: 'Carlos Ruiz Zafón',
    genero: 'Misterio',
    fechaPublicacion: new Date('2001-04-01'),
    editorial: 'Planeta',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El juego del ángel',
    autor: 'Carlos Ruiz Zafón',
    genero: 'Misterio',
    fechaPublicacion: new Date('2008-04-17'),
    editorial: 'Planeta',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El prisionero del cielo',
    autor: 'Carlos Ruiz Zafón',
    genero: 'Misterio',
    fechaPublicacion: new Date('2011-11-17'),
    editorial: 'Planeta',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El psicoanalista',
    autor: 'John Katzenbach',
    genero: 'Thriller',
    fechaPublicacion: new Date('2002-01-01'),
    editorial: 'Anagrama',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El silencio de los corderos',
    autor: 'Thomas Harris',
    genero: 'Thriller',
    fechaPublicacion: new Date('1988-08-29'),
    editorial: 'St. Martin\'s Press',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'It',
    autor: 'Stephen King',
    genero: 'Terror',
    fechaPublicacion: new Date('1986-09-15'),
    editorial: 'Viking Press',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'El resplandor',
    autor: 'Stephen King',
    genero: 'Terror',
    fechaPublicacion: new Date('1977-01-28'),
    editorial: 'Doubleday',
    disponible: true,
    activo: true,
  },
  {
    nombre: 'Carrie',
    autor: 'Stephen King',
    genero: 'Terror',
    fechaPublicacion: new Date('1974-04-05'),
    editorial: 'Doubleday',
    disponible: true,
    activo: true,
  },
];

const usuariosEjemplo = [
  {
    nombre: 'Admin',
    email: 'admin@biblioteca.com',
    password: 'admin123',
    permisos: ['crear_libros', 'modificar_libros', 'modificar_usuarios', 'deshabilitar_libros', 'deshabilitar_usuarios'],
    activo: true,
  },
  {
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'password123',
    permisos: [],
    activo: true,
  },
  {
    nombre: 'María García',
    email: 'maria@example.com',
    password: 'password123',
    permisos: ['crear_libros'],
    activo: true,
  },
];

const seedDatabase = async () => {
  try {
    console.log('Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente.');

    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados.');

    // Verificar si ya existen libros
    const librosExistentes = await Libro.count();
    if (librosExistentes > 0) {
      console.log(`Ya existen ${librosExistentes} libros en la base de datos.`);
      console.log('Agregando más libros...');
    }

    // Insertar libros (ignorar duplicados por nombre)
    console.log('Insertando libros de ejemplo...');
    let librosInsertados = 0;
    for (const libro of librosEjemplo) {
      const [libroCreado, creado] = await Libro.findOrCreate({
        where: { nombre: libro.nombre },
        defaults: libro,
      });
      if (creado) {
        librosInsertados++;
      }
    }
    console.log(`✓ ${librosInsertados} libros nuevos insertados exitosamente.`);
    console.log(`  (${librosEjemplo.length - librosInsertados} libros ya existían)`);

    // Insertar usuarios (ignorar duplicados por email)
    console.log('Insertando usuarios de ejemplo...');
    let usuariosInsertados = 0;
    for (const usuarioData of usuariosEjemplo) {
      const [usuario, creado] = await Usuario.findOrCreate({
        where: { email: usuarioData.email },
        defaults: usuarioData,
      });
      if (creado) {
        usuariosInsertados++;
      } else {
        // Si el usuario ya existe, actualizar la contraseña y permisos para asegurar que sean correctos
        await usuario.update({
          password: usuarioData.password, // Se hasheará automáticamente por el hook
          permisos: usuarioData.permisos,
          activo: usuarioData.activo,
        });
      }
    }
    console.log(`✓ ${usuariosInsertados} usuarios nuevos insertados exitosamente.`);
    console.log(`  (${usuariosEjemplo.length - usuariosInsertados} usuarios ya existían y fueron actualizados)`);
    console.log('\nUsuarios disponibles:');
    console.log('  - admin@biblioteca.com / admin123 (Admin con todos los permisos)');
    console.log('  - juan@example.com / password123 (Usuario normal)');
    console.log('  - maria@example.com / password123 (Usuario con permiso crear_libros)');

    console.log('\n✓ Base de datos poblada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();

