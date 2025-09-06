import 'dotenv/config';
import { orm } from './shared/orm.js';
import { Compania } from './Compania/compania.entity.js';
import { Categoria } from './Categoria/categoria.entity.js';
import { Juego } from './Producto/Juego/juego.entity.js';
import { Servicio } from './Producto/Servicio/servicio.entity.js';
import { Complemento } from './Producto/Complemento/complemento.entity.js';
async function seed() {
    const em = orm.em.fork();
    console.log('Seeding database (masivo)...');
    // 1) Compañías
    const companiasData = [
        { key: 'ea', nombre: 'Electronic Arts', detalle: 'EA' },
        { key: 'epic', nombre: 'Epic Games', detalle: 'Epic' },
        { key: 'activision', nombre: 'Activision', detalle: 'Activision' },
        { key: 'ubisoft', nombre: 'Ubisoft', detalle: 'Ubisoft' },
        { key: 'nintendo', nombre: 'Nintendo', detalle: 'Nintendo' },
        { key: 'sony', nombre: 'Sony Interactive Entertainment', detalle: 'PlayStation Studios' },
        { key: 'bethesda', nombre: 'Bethesda Softworks', detalle: 'Bethesda' },
        { key: 'square', nombre: 'Square Enix', detalle: 'Square Enix' },
        { key: 'rockstar', nombre: 'Rockstar Games', detalle: 'Rockstar' },
        { key: 'take2', nombre: '2K / Take-Two', detalle: '2K Games' },
        { key: 'blizzard', nombre: 'Blizzard Entertainment', detalle: 'Blizzard' },
        { key: 'sega', nombre: 'SEGA', detalle: 'SEGA' },
        { key: 'cdpr', nombre: 'CD PROJEKT RED', detalle: 'CDPR' },
        { key: 'bandai', nombre: 'Bandai Namco', detalle: 'Bandai Namco' },
        { key: 'bungie', nombre: 'Bungie', detalle: 'Bungie' },
        { key: 'xbox', nombre: 'Xbox Game Studios', detalle: 'Microsoft' },
    ];
    const companiasMap = {};
    for (const c of companiasData) {
        companiasMap[c.key] = em.create(Compania, { nombre: c.nombre, detalle: c.detalle });
    }
    // 2) Categorías
    const categoriasData = [
        { key: 'deportes', nombre: 'Deportes', detalle: 'Juegos de deportes' },
        { key: 'accion', nombre: 'Acción', detalle: 'Juegos de acción' },
        { key: 'rpg', nombre: 'RPG', detalle: 'Rol y progresión' },
        { key: 'aventura', nombre: 'Aventura', detalle: 'Exploración y narrativa' },
        { key: 'shooter', nombre: 'Shooter', detalle: 'Disparos en primera/tercera persona' },
        { key: 'carreras', nombre: 'Carreras', detalle: 'Conducción y velocidad' },
        { key: 'estrategia', nombre: 'Estrategia', detalle: 'Tácticas y gestión' },
        { key: 'indie', nombre: 'Indie', detalle: 'Producciones independientes' },
        { key: 'simulacion', nombre: 'Simulación', detalle: 'Simulación y vida' },
        { key: 'puzzle', nombre: 'Puzzle', detalle: 'Rompecabezas y lógica' },
        { key: 'plataformas', nombre: 'Plataformas', detalle: 'Saltar y correr' },
        { key: 'mundoabierto', nombre: 'Mundo Abierto', detalle: 'Exploración libre' },
        { key: 'horror', nombre: 'Terror', detalle: 'Horror y suspenso' },
        { key: 'multiplayer', nombre: 'Multijugador', detalle: 'Enfocado en multijugador' },
        { key: 'battleroyale', nombre: 'Battle Royale', detalle: 'Último en pie' },
        { key: 'suscripcion', nombre: 'Suscripción', detalle: 'Servicios de gaming' },
    ];
    const categoriasMap = {};
    for (const cat of categoriasData) {
        categoriasMap[cat.key] = em.create(Categoria, { nombre: cat.nombre, detalle: cat.detalle });
    }
    await em.persistAndFlush([
        ...Object.values(companiasMap),
        ...Object.values(categoriasMap),
    ]);
    // Helper to add categories
    const addCats = (collection, keys) => {
        const list = Array.from(keys);
        const cats = list.map((k) => categoriasMap[k]).filter(Boolean);
        if (cats.length)
            collection.add(...cats);
    };
    // 3) Juegos (más de 20)
    const juegosData = [
        { key: 'fc24', nombre: 'EA Sports FC 24', detalle: 'Fútbol de última generación', monto: 59.99, comp: 'ea', fecha: '2024-09-01', edad: 3, cats: ['deportes'] },
        { key: 'f1_24', nombre: 'F1 24', detalle: 'La máxima categoría del automovilismo', monto: 69.99, comp: 'ea', fecha: '2024-05-31', edad: 3, cats: ['deportes', 'carreras'] },
        { key: 'sims4', nombre: 'The Sims 4', detalle: 'Crea y controla personas en un mundo virtual', monto: 39.99, comp: 'ea', fecha: '2014-09-02', edad: 12, cats: ['simulacion'] },
        { key: 'bf2042', nombre: 'Battlefield 2042', detalle: 'Guerra moderna a gran escala', monto: 49.99, comp: 'ea', fecha: '2021-11-19', edad: 16, cats: ['accion', 'shooter', 'multiplayer'] },
        { key: 'apex', nombre: 'Apex Legends', detalle: 'Battle Royale gratuito con héroes', monto: 0, comp: 'ea', fecha: '2019-02-04', edad: 16, cats: ['shooter', 'battleroyale', 'multiplayer'] },
        { key: 'mw3', nombre: 'Call of Duty: Modern Warfare III', detalle: 'Shooter de acción', monto: 69.99, comp: 'activision', fecha: '2023-11-01', edad: 18, cats: ['accion', 'shooter', 'multiplayer'] },
        { key: 'diablo4', nombre: 'Diablo IV', detalle: 'Oscuro RPG de acción', monto: 69.99, comp: 'blizzard', fecha: '2023-06-06', edad: 18, cats: ['accion', 'rpg'] },
        { key: 'ow2', nombre: 'Overwatch 2', detalle: 'Héroes y trabajo en equipo', monto: 0, comp: 'blizzard', fecha: '2022-10-04', edad: 13, cats: ['shooter', 'multiplayer'] },
        { key: 'gta5', nombre: 'Grand Theft Auto V', detalle: 'Crimen y mundo abierto', monto: 29.99, comp: 'rockstar', fecha: '2013-09-17', edad: 18, cats: ['accion', 'mundoabierto'] },
        { key: 'rdr2', nombre: 'Red Dead Redemption 2', detalle: 'Aventura en el lejano oeste', monto: 49.99, comp: 'rockstar', fecha: '2018-10-26', edad: 18, cats: ['aventura', 'mundoabierto'] },
        { key: 'cp2077', nombre: 'Cyberpunk 2077', detalle: 'RPG futurista de mundo abierto', monto: 59.99, comp: 'cdpr', fecha: '2020-12-10', edad: 18, cats: ['rpg', 'mundoabierto', 'accion'] },
        { key: 'tw3', nombre: 'The Witcher 3: Wild Hunt', detalle: 'Caza de monstruos y decisiones', monto: 39.99, comp: 'cdpr', fecha: '2015-05-19', edad: 18, cats: ['rpg', 'aventura'] },
        { key: 'acv', nombre: 'Assassin’s Creed Valhalla', detalle: 'Saga vikinga de mundo abierto', monto: 49.99, comp: 'ubisoft', fecha: '2020-11-10', edad: 18, cats: ['accion', 'aventura', 'mundoabierto'] },
        { key: 'r6', nombre: 'Rainbow Six Siege', detalle: 'Tácticas y destrucción', monto: 19.99, comp: 'ubisoft', fecha: '2015-12-01', edad: 16, cats: ['shooter', 'estrategia', 'multiplayer'] },
        { key: 'zelda_totk', nombre: 'The Legend of Zelda: Tears of the Kingdom', detalle: 'Aventura épica en Hyrule', monto: 69.99, comp: 'nintendo', fecha: '2023-05-12', edad: 10, cats: ['aventura', 'mundoabierto'] },
        { key: 'mario_kart8', nombre: 'Mario Kart 8 Deluxe', detalle: 'Carreras al estilo Mario', monto: 59.99, comp: 'nintendo', fecha: '2017-04-28', edad: 3, cats: ['carreras', 'multiplayer'] },
        { key: 'gt7', nombre: 'Gran Turismo 7', detalle: 'Simulación de conducción realista', monto: 69.99, comp: 'sony', fecha: '2022-03-04', edad: 3, cats: ['carreras', 'simulacion'] },
        { key: 'gowr', nombre: 'God of War Ragnarök', detalle: 'Acción y mitología nórdica', monto: 69.99, comp: 'sony', fecha: '2022-11-09', edad: 18, cats: ['accion', 'aventura'] },
        { key: 'hfw', nombre: 'Horizon Forbidden West', detalle: 'Aventura en un mundo postapocalíptico', monto: 59.99, comp: 'sony', fecha: '2022-02-18', edad: 16, cats: ['aventura', 'mundoabierto'] },
        { key: 'fortnite', nombre: 'Fortnite', detalle: 'Construye y sobrevive', monto: 0, comp: 'epic', fecha: '2017-07-21', edad: 12, cats: ['shooter', 'battleroyale', 'multiplayer'] },
        { key: 'elden', nombre: 'Elden Ring', detalle: 'Aventura desafiante en un mundo abierto', monto: 59.99, comp: 'bandai', fecha: '2022-02-25', edad: 16, cats: ['rpg', 'mundoabierto'] },
        { key: 'destiny2', nombre: 'Destiny 2', detalle: 'Shooter de saqueo cooperativo', monto: 0, comp: 'bungie', fecha: '2017-09-06', edad: 16, cats: ['shooter', 'multiplayer', 'accion'] },
        { key: 'yakuza', nombre: 'Yakuza: Like a Dragon', detalle: 'RPG urbano con humor', monto: 39.99, comp: 'sega', fecha: '2020-11-10', edad: 18, cats: ['rpg', 'accion'] },
        { key: 'ffxvi', nombre: 'Final Fantasy XVI', detalle: 'Nueva entrega de la saga de fantasía', monto: 69.99, comp: 'square', fecha: '2023-06-22', edad: 16, cats: ['rpg', 'accion'] },
        { key: 'nba2k24', nombre: 'NBA 2K24', detalle: 'Baloncesto realista', monto: 59.99, comp: 'take2', fecha: '2023-09-08', edad: 3, cats: ['deportes'] },
    ];
    const juegosMap = {};
    for (const j of juegosData) {
        const juego = em.create(Juego, {
            nombre: j.nombre,
            detalle: j.detalle,
            monto: j.monto,
            compania: companiasMap[j.comp],
            fechaLanzamiento: new Date(j.fecha),
            edadPermitida: j.edad,
        });
        addCats(juego.categorias, j.cats);
        juegosMap[j.key] = juego;
    }
    // 4) Servicios (10+)
    const serviciosData = [
        { nombre: 'Xbox Game Pass Ultimate - 1 Mes', detalle: 'Catálogo en consola y PC', monto: 14.99, comp: 'xbox', cats: ['suscripcion'] },
        { nombre: 'PlayStation Plus Extra - 1 Mes', detalle: 'Catálogo PS4/PS5', monto: 13.99, comp: 'sony', cats: ['suscripcion'] },
        { nombre: 'Nintendo Switch Online - 12 Meses', detalle: 'Juego online y catálogo clásico', monto: 19.99, comp: 'nintendo', cats: ['suscripcion'] },
        { nombre: 'EA Play - 1 Mes', detalle: 'Juegos de EA y pruebas anticipadas', monto: 4.99, comp: 'ea', cats: ['suscripcion'] },
        { nombre: 'Ubisoft+ - 1 Mes', detalle: 'Acceso a lanzamientos de Ubisoft', monto: 14.99, comp: 'ubisoft', cats: ['suscripcion'] },
        { nombre: 'Fortnite Crew - 1 Mes', detalle: 'Pase mensual con V-Bucks y skins', monto: 11.99, comp: 'epic', cats: ['suscripcion'] },
        { nombre: 'GTA+ - 1 Mes', detalle: 'Beneficios en GTA Online', monto: 5.99, comp: 'rockstar', cats: ['suscripcion'] },
        { nombre: 'World of Warcraft - 60 días', detalle: 'Tiempo de juego para WoW', monto: 29.99, comp: 'blizzard', cats: ['suscripcion'] },
        { nombre: 'The Elder Scrolls Online Plus - 1 Mes', detalle: 'Beneficios premium en TESO', monto: 14.99, comp: 'bethesda', cats: ['suscripcion'] },
        { nombre: 'Destiny 2 Lightfall (pase de temporada)', detalle: 'Temporada y contenido', monto: 9.99, comp: 'bungie', cats: ['suscripcion'] },
    ];
    const servicios = [];
    for (const s of serviciosData) {
        const serv = em.create(Servicio, {
            nombre: s.nombre,
            detalle: s.detalle,
            monto: s.monto,
            compania: companiasMap[s.comp],
        });
        addCats(serv.categorias, s.cats);
        servicios.push(serv);
    }
    // 5) Complementos (monedas/DLC ligados a juegos)
    const complData = [
        { nombre: 'V-Bucks 2800', detalle: 'Moneda para Fortnite', monto: 19.99, comp: 'epic', juego: 'fortnite', cats: ['battleroyale', 'multiplayer'] },
        { nombre: 'V-Bucks 5000', detalle: 'Moneda para Fortnite', monto: 31.99, comp: 'epic', juego: 'fortnite', cats: ['battleroyale', 'multiplayer'] },
        { nombre: 'COD Points 2400', detalle: 'Moneda para Call of Duty', monto: 19.99, comp: 'activision', juego: 'mw3', cats: ['shooter', 'accion'] },
        { nombre: 'COD Points 5000', detalle: 'Moneda para Call of Duty', monto: 39.99, comp: 'activision', juego: 'mw3', cats: ['shooter', 'accion'] },
        { nombre: 'FIFA Points 4600', detalle: 'Puntos para FC 24', monto: 39.99, comp: 'ea', juego: 'fc24', cats: ['deportes'] },
        { nombre: 'FIFA Points 12000', detalle: 'Puntos para FC 24', monto: 99.99, comp: 'ea', juego: 'fc24', cats: ['deportes'] },
        { nombre: 'Apex Coins 2150', detalle: 'Moneda para Apex Legends', monto: 19.99, comp: 'ea', juego: 'apex', cats: ['battleroyale', 'multiplayer'] },
        { nombre: 'Overwatch Coins 1000', detalle: 'Moneda para Overwatch 2', monto: 9.99, comp: 'blizzard', juego: 'ow2', cats: ['shooter', 'multiplayer'] },
        { nombre: 'Diablo IV Platinum 1000', detalle: 'Moneda para Diablo IV', monto: 9.99, comp: 'blizzard', juego: 'diablo4', cats: ['rpg', 'accion'] },
        { nombre: 'Shark Cash Card (Whale) - GTA Online', detalle: 'Dinero para GTA Online', monto: 49.99, comp: 'rockstar', juego: 'gta5', cats: ['mundoabierto'] },
        { nombre: 'RDO Gold Bars 25', detalle: 'Oro para Red Dead Online', monto: 9.99, comp: 'rockstar', juego: 'rdr2', cats: ['mundoabierto'] },
        { nombre: 'Forza Horizon 5 Car Pass', detalle: 'Coches adicionales', monto: 29.99, comp: 'xbox', juego: 'gta5', cats: ['carreras'] },
        { nombre: 'Rainbow Six Credits 2670', detalle: 'Moneda para R6 Siege', monto: 19.99, comp: 'ubisoft', juego: 'r6', cats: ['estrategia', 'shooter'] },
        { nombre: 'Elden Ring Shadow of the Erdtree', detalle: 'Expansión', monto: 39.99, comp: 'bandai', juego: 'elden', cats: ['rpg'] },
        { nombre: 'Cyberpunk 2077: Phantom Liberty', detalle: 'Expansión', monto: 29.99, comp: 'cdpr', juego: 'cp2077', cats: ['rpg', 'mundoabierto'] },
    ];
    const complementos = [];
    for (const c of complData) {
        const juegoRef = juegosMap[c.juego];
        if (!juegoRef)
            continue;
        const comp = em.create(Complemento, {
            nombre: c.nombre,
            detalle: c.detalle,
            monto: c.monto,
            compania: companiasMap[c.comp],
            juego: juegoRef,
        });
        addCats(comp.categorias, c.cats);
        complementos.push(comp);
    }
    await em.persistAndFlush([
        ...Object.values(juegosMap),
        ...servicios,
        ...complementos,
    ]);
    console.log('Seed masivo completo.');
    await orm.close(true);
}
seed().catch(async (e) => {
    console.error(e);
    await orm.close(true);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map