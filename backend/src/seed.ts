import 'reflect-metadata'
import './shared/orm.js'
import { orm } from './shared/orm.js'
import { Categoria } from './Categoria/categoria.entity.js'
import { Compania } from './Compania/compania.entity.js'
import { Juego } from './Producto/Juego/juego.entity.js'
import { Servicio } from './Producto/Servicio/servicio.entity.js'
import { Complemento } from './Producto/Complemento/complemento.entity.js'
import { Usuario } from './Usuario/usuario.entity.js'
import { Venta } from './Venta/venta.entity.js'
import { Resenia } from './Resenia/resenia.entity.js'
import { FotoProducto } from './Producto/FotoProducto/fotoProducto.entity.js'

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const sample = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

// ==============================
// Imágenes (URLs estáticas)
// ==============================
// NOTA de licencias: usamos Pexels (libre uso) para imágenes temáticas y Wikimedia para logos de servicios.



// Helper para normalizar nombres para Cloudinary
function normalizeCloudinaryName(nombre: string): string {
  return nombre
    .normalize('NFD')
    .replace(/['’-]/g, '') // quita comillas y guiones
    .replace(/[áàäâã]/gi, 'a')
    .replace(/[éèëê]/gi, 'e')
    .replace(/[íìïî]/gi, 'i')
    .replace(/[óòöôõ]/gi, 'o')
    .replace(/[úùüû]/gi, 'u')
    .replace(/[: ]/g, '_')
    .toLowerCase();
}

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dbrfi383s/image/upload';
const cloudinaryUrl = (tipo: 'juego' | 'complemento' | 'servicio', nombre: string) =>
  `${CLOUDINARY_BASE}/${tipo}/${normalizeCloudinaryName(nombre)}.jpg`;

// Avatares disponibles para usuarios
const avatares = [
  'https://res.cloudinary.com/dbrfi383s/image/upload/usuario/silksong.jpg',
  'https://res.cloudinary.com/dbrfi383s/image/upload/usuario/avatar1.jpg',
  'https://res.cloudinary.com/dbrfi383s/image/upload/usuario/avatar2.jpg',
  'https://res.cloudinary.com/dbrfi383s/image/upload/usuario/avatar3.jpg',
  'https://res.cloudinary.com/dbrfi383s/image/upload/usuario/avatar4.jpg',
  'https://res.cloudinary.com/dbrfi383s/image/upload/usuario/avatar5.jpg',
  'https://res.cloudinary.com/dbrfi383s/image/upload/usuario/avatar6.jpg',
  'https://res.cloudinary.com/dbrfi383s/image/upload/usuario/avatar7.jpg',
  'https://res.cloudinary.com/dbrfi383s/image/upload/usuario/avatar8.jpg',
  'https://res.cloudinary.com/dbrfi383s/image/upload/usuario/avatar9.jpg',
  'https://res.cloudinary.com/dbrfi383s/image/upload/usuario/avatar10.jpg',
];

// Juegos: imágenes Cloudinary por título
const imagesByJuego: Record<string, string[]> = {
  'Elden Ring': [cloudinaryUrl('juego', 'Elden Ring')],
  'Cyberpunk 2077': [cloudinaryUrl('juego', 'Cyberpunk 2077')],
  'The Witcher 3': [cloudinaryUrl('juego', 'The Witcher 3')],
  'GTA V': [cloudinaryUrl('juego', 'GTA V')],
  'RDR2': [cloudinaryUrl('juego', 'RDR2')],
  'Zelda TotK': [cloudinaryUrl('juego', 'Zelda TotK')],
  'Mario Kart 8': [cloudinaryUrl('juego', 'Mario Kart 8')],
  'God of War': [cloudinaryUrl('juego', 'God of War')],
  'Horizon FW': [cloudinaryUrl('juego', 'Horizon FW')],
  'Spider-Man 2': [cloudinaryUrl('juego', 'Spider-Man 2')],
  'FC 24': [cloudinaryUrl('juego', 'FC 24')],
  'F1 24': [cloudinaryUrl('juego', 'F1 24')],
  'Battlefield 2042': [cloudinaryUrl('juego', 'Battlefield 2042')],
  'Apex Legends': [cloudinaryUrl('juego', 'Apex Legends')],
  'Overwatch 2': [cloudinaryUrl('juego', 'Overwatch 2')],
  'Diablo IV': [cloudinaryUrl('juego', 'Diablo IV')],
  'Fortnite': [cloudinaryUrl('juego', 'Fortnite'),
              cloudinaryUrl('complemento', 'Temporada 1'),
              cloudinaryUrl('complemento', 'Temporada 2')],
  'Destiny 2': [cloudinaryUrl('juego', 'Destiny 2')],
  'AC Valhalla': [cloudinaryUrl('juego', 'AC Valhalla')],
  'Rainbow Six Siege': [cloudinaryUrl('juego', 'Rainbow Six Siege')],
  'Gran Turismo 7': [cloudinaryUrl('juego', 'Gran Turismo 7')],
  'Starfield': [cloudinaryUrl('juego', 'Starfield')],
  'Halo Infinite': [cloudinaryUrl('juego', 'Halo Infinite')],
  'Forza Horizon 5': [cloudinaryUrl('juego', 'Forza Horizon 5')],
  'Yakuza LAD': [cloudinaryUrl('juego', 'Yakuza LAD')],
  'Final Fantasy XVI': [cloudinaryUrl('juego', 'Final Fantasy XVI')],
  'Monster Hunter Rise': [cloudinaryUrl('juego', 'Monster Hunter Rise')],
  'Sekiro': [cloudinaryUrl('juego', 'Sekiro')],
  'Resident Evil 4': [cloudinaryUrl('juego', 'Resident Evil 4')],
  'Street Fighter 6': [cloudinaryUrl('juego', 'Street Fighter 6')],
  'Baldur’s Gate 3': [cloudinaryUrl('juego', 'Baldur’s Gate 3')],
  'Ghost of Tsushima': [cloudinaryUrl('juego', 'Ghost of Tsushima')],
  'Bloodborne': [cloudinaryUrl('juego', 'Bloodborne')],
  'Death Stranding': [cloudinaryUrl('juego', 'Death Stranding')],
  'No Man’s Sky': [cloudinaryUrl('juego', 'No Man’s Sky')],
  'Skyrim': [cloudinaryUrl('juego', 'Skyrim')],
}

// Servicios: imágenes Cloudinary por nombre
const imagesByServicio: Record<string, string[]> = {
  'Xbox Game Pass': [cloudinaryUrl('servicio', 'Xbox Game Pass')],
  'PlayStation Plus': [cloudinaryUrl('servicio', 'PlayStation Plus')],
  'Nintendo Switch Online': [cloudinaryUrl('servicio', 'Nintendo Switch Online')],
  'EA Play': [cloudinaryUrl('servicio', 'EA Play')],
  'Ubisoft+': [cloudinaryUrl('servicio', 'Ubisoft+')],
  'GeForce NOW': [cloudinaryUrl('servicio', 'GeForce NOW')],
  'Prime Gaming': [cloudinaryUrl('servicio', 'Prime Gaming')],
  'Apple Arcade': [cloudinaryUrl('servicio', 'Apple Arcade')],
  'Fortnite Crew': [cloudinaryUrl('servicio', 'Fortnite Crew')],
  'Blizzard Arcade': [cloudinaryUrl('servicio', 'Blizzard Arcade')],
  'ESO Plus': [cloudinaryUrl('servicio', 'ESO Plus')],
  'Destiny 2 Season': [cloudinaryUrl('servicio', 'Destiny 2 Season')],
  'WoW Time': [cloudinaryUrl('servicio', 'WoW Time')],
  'Netflix Games': [cloudinaryUrl('servicio', 'Netflix Games')],
  'PS Now Legacy': [cloudinaryUrl('servicio', 'PS Now Legacy')],
  'GTA+': [cloudinaryUrl('servicio', 'GTA+')],
}

// Complementos: imágenes Cloudinary por nombre
const imagesByComplemento: Record<string, string[]> = {
  'V-Bucks': [cloudinaryUrl('complemento', 'V-Bucks')],
  'COD Points': [cloudinaryUrl('complemento', 'COD Points')],
  'FIFA Points': [cloudinaryUrl('complemento', 'FIFA Points')],
  'Apex Coins': [cloudinaryUrl('complemento', 'Apex Coins')],
  'Overwatch Coins': [cloudinaryUrl('complemento', 'Overwatch Coins')],
  'Diablo Platinum': [cloudinaryUrl('complemento', 'Diablo Platinum')],
  'Shark Cards': [cloudinaryUrl('complemento', 'Shark Cards')],
  'Forza Car Pass': [cloudinaryUrl('complemento', 'Forza Car Pass')],
  'Rainbow Six Credits': [cloudinaryUrl('complemento', 'Rainbow Six Credits')],
  'Pase de Batalla': [cloudinaryUrl('complemento', 'Pase de Batalla')],
  'Paquete Skins': [cloudinaryUrl('complemento', 'Paquete Skins')],
  'RDO Gold': [cloudinaryUrl('complemento', 'RDO Gold')],
  'DLC Historia I': [cloudinaryUrl('complemento', 'DLC Historia I')],
  'DLC Historia II': [cloudinaryUrl('complemento', 'DLC Historia II')],
  'Temporada 1': [cloudinaryUrl('complemento', 'Temporada 1')],
  'Temporada 2': [cloudinaryUrl('complemento', 'Temporada 2')],
  'Armas Épicas': [cloudinaryUrl('complemento', 'Armas Épicas')],
  'Mapa Extra': [cloudinaryUrl('complemento', 'Mapa Extra')],
  'Pack Música': [cloudinaryUrl('complemento', 'Pack Música')],
  'Pack Vehículos': [cloudinaryUrl('complemento', 'Pack Vehículos')],
  'Traje Especial': [cloudinaryUrl('complemento', 'Traje Especial')],
  'Emoji Pack': [cloudinaryUrl('complemento', 'Emoji Pack')],
  'Filtro Retro': [cloudinaryUrl('complemento', 'Filtro Retro')],
  'HUD Temático': [cloudinaryUrl('complemento', 'HUD Temático')],
  'Animación Especial': [cloudinaryUrl('complemento', 'Animación Especial')],
  'DLC Boss Rush': [cloudinaryUrl('complemento', 'DLC Boss Rush')],
  'DLC Arena': [cloudinaryUrl('complemento', 'DLC Arena')],
  'Pack Texturas': [cloudinaryUrl('complemento', 'Pack Texturas')],
  'Pack Voces': [cloudinaryUrl('complemento', 'Pack Voces')],
  'Pack Celebración': [cloudinaryUrl('complemento', 'Pack Celebración')],
}

async function resetSchema() {
  const gen = orm.getSchemaGenerator()
  await gen.dropSchema()
  await gen.createSchema()
}

function makeCode(prefix: string) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 16; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return `${prefix}-${out}`
}

async function main() {
  console.log('Seeding: reset schema...')
  await resetSchema()

  const em = orm.em.fork()

  // Categorías 
  const catsData: Array<{ nombre: string; detalle: string }> = [
    { nombre: 'Deportes', detalle: 'Juegos de deportes' },
    { nombre: 'Acción', detalle: 'Juegos de acción' },
    { nombre: 'Suscripción', detalle: 'Servicios de gaming' },
    { nombre: 'RPG', detalle: 'Rol y progresión' },
    { nombre: 'Aventura', detalle: 'Exploración y narrativa' },
    { nombre: 'Shooter', detalle: 'Disparos en primera/tercera persona' },
    { nombre: 'Carreras', detalle: 'Conducción y velocidad' },
    { nombre: 'Estrategia', detalle: 'Tácticas y gestión' },
    { nombre: 'Indie', detalle: 'Producciones independientes' },
    { nombre: 'Simulación', detalle: 'Simulación y vida' },
    { nombre: 'Puzzle', detalle: 'Rompecabezas y lógica' },
    { nombre: 'Plataformas', detalle: 'Saltar y correr' },
    { nombre: 'Mundo Abierto', detalle: 'Exploración libre' },
    { nombre: 'Terror', detalle: 'Horror y suspenso' },
    { nombre: 'Multijugador', detalle: 'Enfocado en multijugador' },
    { nombre: 'Battle Royale', detalle: 'Último en pie' },
  ]
  const categorias: Categoria[] = catsData.map((cd) => {
    const c = new Categoria()
    c.nombre = cd.nombre
    c.detalle = cd.detalle
    return c
  })
  await em.persistAndFlush(categorias)

  // Compañías (>=20)
  const companyNames = [
    'EA','Ubisoft','Nintendo','Sony','Microsoft','Rockstar','Take-Two','Bethesda','Square Enix','Bandai Namco',
    'Sega','Capcom','CD Projekt','Activision','Blizzard','Epic Games','Bungie','FromSoftware','Konami','2K'
  ]
  const companias: Compania[] = companyNames.map((n) => {
    const co = new Compania()
    co.nombre = n
    co.detalle = `Compañía ${n}`
    return co
  })
  await em.persistAndFlush(companias)

  // Usuarios (asegurar #1 gamer@gmail.com / 123456) y muchos usuarios con nombres reales
  const usuarios: Usuario[] = []
  const u1 = new Usuario()
  u1.nombreUsuario = 'gamer'
  u1.mail = 'gamer@gmail.com'
  u1.contrasenia = '123456'
  u1.nombre = 'Gamer Uno'
  u1.fechaNacimiento = new Date('1995-01-15')
  u1.fechaCreacion = new Date()
  u1.tipoUsuario = 'cliente'
  u1.urlFoto = sample(avatares)
  usuarios.push(u1)

  const firstNames = [
    'Sofía','Mateo','Valentina','Benjamín','Emma','Thiago','Isabella','Santiago','Martina','Lucas',
    'Camila','Joaquín','Catalina','Lautaro','Mía','Julián','Victoria','Tomás','Agustina','Bruno',
    'Lucía','Franco','Paula','Nicolás','Abril','Diego','Luna','Facundo','Florencia','Gael',
    'Antonella','Ramiro','Carolina','Ignacio','Bianca','Emilia','Juan','Pilar','Gonzalo','Zoe'
  ]
  const lastNames = [
    'González','Rodríguez','Fernández','Gómez','López','Martínez','Pérez','Sánchez','Ramírez','Torres',
    'Flores','Rivera','Romero','Suárez','Molina','Silva','Castro','Morales','Herrera','Vega',
    'Rojas','Navarro','Campos','Vázquez','Ibarra','Núñez','Cruz','Ortega','Peña','Méndez'
  ]
  const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  let userCount = 0
  const totalExtraUsers = 120
  for (let i = 0; i < totalExtraUsers; i++) {
    const fn = sample(firstNames)
    const ln = sample(lastNames)
    const nombre = `${fn} ${ln}`
    const base = normalize(`${fn}${ln}`)
    const suffix = i.toString().padStart(2, '0')
    const username = `${base}${suffix}`.slice(0, 20)
  const u = new Usuario()
  u.nombreUsuario = username
  u.mail = `${base}.${suffix}@example.com`
  u.contrasenia = '123456'
  u.nombre = nombre
  u.fechaNacimiento = new Date(rand(1975, 2008), rand(0,11), rand(1,28))
  u.fechaCreacion = new Date()
  u.tipoUsuario = 'cliente'
  u.urlFoto = sample(avatares)
  usuarios.push(u)
    userCount++
  }
  await em.persistAndFlush(usuarios)
  // Usuario admin
  const admin = new Usuario()
  admin.nombreUsuario = 'admin'
  admin.mail = 'portalvideojuegos@yahoo.com'
  admin.contrasenia = '123456'
  admin.nombre = 'Admin'
  admin.fechaNacimiento = new Date('1990-01-01')
  admin.fechaCreacion = new Date()
  admin.tipoUsuario = 'admin'
  admin.urlFoto = 'https://res.cloudinary.com/dbrfi383s/image/upload/usuario/avatar_cabra.jpg'
  await em.persistAndFlush([admin])
  console.log(`Usuarios: ${usuarios.length}`)

  // Juegos (>=30)
  const gameTitles = [
    'Elden Ring','Cyberpunk 2077','The Witcher 3','GTA V','RDR2','Zelda TotK','Mario Kart 8','God of War',
  'Horizon FW','Spider-Man 2','FC 24','F1 24','Battlefield 2042','Apex Legends','Overwatch 2','Diablo IV',
    'Fortnite','Destiny 2','AC Valhalla','Rainbow Six Siege','Gran Turismo 7','Starfield','Halo Infinite',
    'Forza Horizon 5','Yakuza LAD','Final Fantasy XVI','Monster Hunter Rise','Sekiro','Resident Evil 4','Street Fighter 6',
    'Baldur’s Gate 3','Ghost of Tsushima','Bloodborne','Death Stranding','No Man’s Sky','Skyrim'
  ]
  const juegos: Juego[] = []
  for (let i = 0; i < 35; i++) {
    const j = new Juego()
    j.nombre = gameTitles[i] || `Juego ${i+1}`
    j.detalle = `Detalle de ${j.nombre}`
    j.monto = rand(0, 70)
    j.compania = sample(companias)
    j.fechaLanzamiento = new Date(rand(2014, 2025), rand(0,11), rand(1,28))
    j.edadPermitida = sample([0, 10, 13, 17, 18])
    // categorías aleatorias (1-3)
    const cats = [...categorias].sort(() => 0.5 - Math.random()).slice(0, rand(1,3))
    cats.forEach(c => j.categorias.add(c as any))
    juegos.push(j)
  }
  await em.persistAndFlush(juegos)
  console.log(`Juegos: ${juegos.length}`)

  // Fotos para Juegos (1–3, principal la primera); fallback temático si no hay mapeo
  const fotosJuegos: FotoProducto[] = []
  for (const j of juegos) {
    const urls = [...(imagesByJuego[j.nombre] ?? [])]
  if (urls.length === 0) urls.push(cloudinaryUrl('juego', 'gamepad generico')) // gamepad genérico
    for (let i = 0; i < urls.length && i < 3; i++) {
      const f = new FotoProducto()
      f.url = urls[i]
      f.esPrincipal = i === 0
      ;(f as any).juego = j as any
      fotosJuegos.push(f)
    }
  }
  await em.persistAndFlush(fotosJuegos)

  // Servicios (>=16)
  const serviceNames = [
    'Xbox Game Pass','PlayStation Plus','Nintendo Switch Online','EA Play','Ubisoft+',
    'GTA+','Fortnite Crew','Blizzard Arcade','ESO Plus','Destiny 2 Season',
    'WoW Time','Netflix Games','GeForce NOW','PS Now Legacy','Apple Arcade','Prime Gaming'
  ]
  const servicios: Servicio[] = []
  for (let i = 0; i < 16; i++) {
    const s = new Servicio()
    s.nombre = serviceNames[i] || `Servicio ${i+1}`
    s.detalle = `Detalle de ${s.nombre}`
    s.monto = rand(2, 20)
    s.compania = sample(companias)
    const cats = [...categorias].sort(() => 0.5 - Math.random()).slice(0, rand(1,2))
    cats.forEach(c => s.categorias.add(c as any))
    servicios.push(s)
  }
  await em.persistAndFlush(servicios)
  console.log(`Servicios: ${servicios.length}`)

  // Fotos para Servicios (1–2 según mapeo); mantenemos los logos curados
  const fotosServicios: FotoProducto[] = []
  for (const s of servicios) {
    const urls = [...(imagesByServicio[s.nombre] ?? [])]
    // fallback neutral mínimo si un servicio no está en el mapeo (evitar placeholders con texto)
    if (urls.length === 0) urls.push('https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Icon_-_image.svg/64px-Icon_-_image.svg.png')
    for (let i = 0; i < urls.length && i < 2; i++) {
      const f = new FotoProducto()
      f.url = urls[i]
      f.esPrincipal = i === 0
      ;(f as any).servicio = s as any
      fotosServicios.push(f)
    }
  }
  await em.persistAndFlush(fotosServicios)

  // Complementos (>=30)
  const compNames = [
    'V-Bucks','COD Points','FIFA Points','Apex Coins','Overwatch Coins','Diablo Platinum','Shark Cards',
    'RDO Gold','Forza Car Pass','Rainbow Six Credits','DLC Historia I','DLC Historia II','Temporada 1',
    'Temporada 2','Paquete Skins','Armas Épicas','Mapa Extra','Pase de Batalla','Pack Música','Pack Vehículos',
    'Traje Especial','Emoji Pack','Filtro Retro','HUD Temático','Animación Especial','DLC Boss Rush','DLC Arena',
    'Pack Texturas','Pack Voces','Pack Celebración','DLC Multijugador'
  ]
  const complementos: Complemento[] = []
  for (let i = 0; i < 30; i++) {
    const c = new Complemento()
    c.nombre = compNames[i] || `Complemento ${i+1}`
    c.detalle = `Detalle de ${c.nombre}`
    c.monto = rand(1, 30)
    c.compania = sample(companias)
    c.juego = sample(juegos) as any
    const cats = [...categorias].sort(() => 0.5 - Math.random()).slice(0, rand(1,2))
    cats.forEach(cat => c.categorias.add(cat as any))
    complementos.push(c)
  }
  await em.persistAndFlush(complementos)
  console.log(`Complementos: ${complementos.length}`)

  // Fotos para Complementos (1–2 desde mapeo Pexels; fallback temático si falta)
  const fotosComplementos: FotoProducto[] = []
  for (const c of complementos) {
    const urls = [...(imagesByComplemento[c.nombre] ?? [])]
  if (urls.length === 0) urls.push(cloudinaryUrl('complemento', 'moneda tema in-game')) // moneda/tema in-game
    for (let i = 0; i < urls.length && i < 2; i++) {
      const f = new FotoProducto()
      f.url = urls[i]
      f.esPrincipal = i === 0
      ;(f as any).complemento = c as any
      fotosComplementos.push(f)
    }
  }
  await em.persistAndFlush(fotosComplementos)

  // Ventas + Reseñas
  const ventas: Venta[] = []
  const resenias: Resenia[] = []
  const allUsers = usuarios

  // Crear ventas (unas 200)
  for (let i = 0; i < 200; i++) {
    const v = new Venta()
    v.usuario = sample(allUsers) as any
    v.fecha = new Date(rand(2022, 2025), rand(0,11), rand(1,28))
    v.codActivacion = makeCode('ACT')
  const tipo = sample(['juego','servicio','complemento'])
    if (tipo === 'juego') v.juego = sample(juegos) as any
    if (tipo === 'servicio') v.servicio = sample(servicios) as any
    if (tipo === 'complemento') v.complemento = sample(complementos) as any
    ventas.push(v)
  }
  await em.persistAndFlush(ventas)
  console.log(`Ventas: ${ventas.length}`)

  // Reseñas: crear para ~60% de ventas, con variedad realista
  const reviewTexts: Record<number, string[]> = {
    5: [
      'Increíble experiencia, superó mis expectativas.',
      'Excelente calidad y muy divertido, 100% recomendado.',
      'Historia atrapante y rendimiento impecable.',
      'Arte y música de primer nivel, una joya.',
      'Multijugador muy sólido, partidas fluidas.'
    ],
    4: [
      'Muy bueno en general, pequeños detalles por pulir.',
      'Gran propuesta, lo disfruté mucho.',
      'Buen contenido y balance aceptable.',
      'Visualmente destaca, jugabilidad sólida.',
      'Me encantó, pero podría tener mejor matchmaking.'
    ],
    3: [
      'Entretenido por ratos, repetitivo a la larga.',
      'Cumple, pero nada sobresaliente.',
      'Algunas caídas de FPS y bugs menores.',
      'Sistema de progresión correcto, sin brillar.',
      'Podría mejorar el contenido endgame.'
    ],
    2: [
      'Varias fallas técnicas y balance flojo.',
      'Pay-to-win en algunos modos, desmotiva.',
      'La historia no engancha y los controles se sienten raros.',
      'Demasiado grind, progreso lento.',
      'Modo online inestable en horas pico.'
    ],
    1: [
      'Mala optimización, crasheos frecuentes.',
      'No cumple lo prometido, decepcionante.',
      'Contenidos pobres y microtransacciones agresivas.',
      'Controles imprecisos, mala experiencia.',
      'Soporte técnico inexistente, mala compra.'
    ],
  }
  const weightedScore = () => {
    // 5:35%, 4:25%, 3:25%, 2:10%, 1:5%
    const r = Math.random()
    if (r < 0.35) return 5
    if (r < 0.60) return 4
    if (r < 0.85) return 3
    if (r < 0.95) return 2
    return 1
  }
  const reviewsToCreate = Math.floor(ventas.length * 0.6)
  const picked = [...ventas].sort(() => 0.5 - Math.random()).slice(0, reviewsToCreate)
  for (const v of picked) {
    const r = new Resenia()
    r.usuario = v.usuario
    r.venta = v as any
    r.puntaje = weightedScore()
    const pool = reviewTexts[r.puntaje] || reviewTexts[3]
    r.detalle = sample(pool)
    r.fecha = new Date(v.fecha.getTime() + rand(1,60) * 86400000)
    resenias.push(r)
  }
  await em.persistAndFlush(resenias)
  console.log(`Reseñas: ${resenias.length}`)

  console.log('Seed completo.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await orm.close(true)
  })