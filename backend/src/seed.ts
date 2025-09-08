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

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const sample = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

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
    usuarios.push(u)
    userCount++
  }
  await em.persistAndFlush(usuarios)
  console.log(`Usuarios: ${usuarios.length}`)

  // Juegos (>=30)
  const gameTitles = [
    'Elden Ring','Cyberpunk 2077','The Witcher 3','GTA V','RDR2','Zelda TotK','Mario Kart 8','God of War',
    'Horizon FW','Spider-Man 2','FIFA 24','F1 24','Battlefield 2042','Apex Legends','Overwatch 2','Diablo IV',
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
    j.edadPermitida = sample([7,12,14,16,18])
    // categorías aleatorias (1-3)
    const cats = [...categorias].sort(() => 0.5 - Math.random()).slice(0, rand(1,3))
    cats.forEach(c => j.categorias.add(c as any))
    juegos.push(j)
  }
  await em.persistAndFlush(juegos)
  console.log(`Juegos: ${juegos.length}`)

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
    const tipo = sample(['juego','servicio','complemento'] as const)
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
