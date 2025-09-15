import { orm } from '../shared/orm.js';
import { Juego } from '../Producto/Juego/juego.entity.js';
import { Servicio } from '../Producto/Servicio/servicio.entity.js';
import { Complemento } from '../Producto/Complemento/complemento.entity.js';
export async function search(req, res) {
    try {
        const em = orm.em.fork();
        const q = req.query.q?.trim() || '';
        const tipo = (req.query.tipo || 'todos').toLowerCase();
        const companiaId = req.query.companiaId ? Number(req.query.companiaId) : undefined;
        const categoriaId = req.query.categoriaId ? Number(req.query.categoriaId) : undefined;
        const priceMin = req.query.priceMin ? Number(req.query.priceMin) : undefined;
        const priceMax = req.query.priceMax ? Number(req.query.priceMax) : undefined;
        const edadMax = req.query.edadMax ? Number(req.query.edadMax) : undefined; // solo juegos
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
        const offset = (page - 1) * limit;
        const like = q ? `%${q}%` : undefined;
        const buildBaseWhere = () => ({
            ...(like ? { $or: [{ nombre: { $like: like } }, { detalle: { $like: like } }] } : {}),
            ...(companiaId ? { compania: companiaId } : {}),
            ...(priceMin !== undefined ? { monto: { $gte: priceMin } } : {}),
            ...(priceMax !== undefined ? { ...(priceMin !== undefined ? { monto: { $gte: priceMin, $lte: priceMax } } : { monto: { $lte: priceMax } }) } : {}),
        });
        const queries = [];
        if (tipo === 'juego' || tipo === 'todos') {
            const whereJuego = {
                ...buildBaseWhere(),
                ...(edadMax !== undefined ? { edadPermitida: { $lte: edadMax } } : {}),
                ...(categoriaId ? { categorias: { id: categoriaId } } : {}),
            };
            queries.push(em.find(Juego, whereJuego, {
                populate: ['compania', 'categorias', 'fotos'],
                limit,
                offset,
                orderBy: { id: 'asc' },
            }));
        }
        if (tipo === 'servicio' || tipo === 'todos') {
            const whereServicio = {
                ...buildBaseWhere(),
                ...(categoriaId ? { categorias: { id: categoriaId } } : {}),
            };
            queries.push(em.find(Servicio, whereServicio, {
                populate: ['compania', 'categorias', 'fotos'],
                limit,
                offset,
                orderBy: { id: 'asc' },
            }));
        }
        if (tipo === 'complemento' || tipo === 'todos') {
            const whereComplemento = {
                ...buildBaseWhere(),
                ...(categoriaId ? { categorias: { id: categoriaId } } : {}),
            };
            queries.push(em.find(Complemento, whereComplemento, {
                populate: ['compania', 'categorias', 'juego', 'fotos'],
                limit,
                offset,
                orderBy: { id: 'asc' },
            }));
        }
        const results = await Promise.all(queries);
        const items = [];
        for (const list of results) {
            for (const r of list) {
                if (r instanceof Juego) {
                    const fotos = r.fotos?.toArray?.();
                    const principal = fotos?.find(f => f.esPrincipal) ?? fotos?.[0];
                    items.push({
                        id: r.id,
                        tipo: 'juego',
                        nombre: r.nombre,
                        detalle: r.detalle,
                        monto: r.monto,
                        compania: r.compania ? { id: r.compania.id, nombre: r.compania.nombre } : null,
                        categorias: r.categorias?.toArray?.().map((c) => ({ id: c.id, nombre: c.nombre })) ?? [],
                        fechaLanzamiento: r.fechaLanzamiento,
                        edadPermitida: r.edadPermitida,
                        imageUrl: principal?.url ?? null,
                    });
                }
                else if (r instanceof Servicio) {
                    const fotos = r.fotos?.toArray?.();
                    const principal = fotos?.find(f => f.esPrincipal) ?? fotos?.[0];
                    items.push({
                        id: r.id,
                        tipo: 'servicio',
                        nombre: r.nombre,
                        detalle: r.detalle,
                        monto: r.monto,
                        compania: r.compania ? { id: r.compania.id, nombre: r.compania.nombre } : null,
                        categorias: r.categorias?.toArray?.().map((c) => ({ id: c.id, nombre: c.nombre })) ?? [],
                        imageUrl: principal?.url ?? null,
                    });
                }
                else if (r instanceof Complemento) {
                    const fotos = r.fotos?.toArray?.();
                    const principal = fotos?.find(f => f.esPrincipal) ?? fotos?.[0];
                    items.push({
                        id: r.id,
                        tipo: 'complemento',
                        nombre: r.nombre,
                        detalle: r.detalle,
                        monto: r.monto,
                        compania: r.compania ? { id: r.compania.id, nombre: r.compania.nombre } : null,
                        categorias: r.categorias?.toArray?.().map((c) => ({ id: c.id, nombre: c.nombre })) ?? [],
                        juegoRelacionado: r.juego ? { id: r.juego.id, nombre: r.juego.nombre } : null,
                        imageUrl: principal?.url ?? null,
                    });
                }
            }
        }
        res.status(200).json({
            message: 'search ok',
            page,
            limit,
            count: items.length,
            data: items,
        });
    }
    catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: error.message || 'internal error' });
    }
}
//# sourceMappingURL=search.controller.js.map