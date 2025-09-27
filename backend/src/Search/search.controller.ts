import { Request, Response } from 'express';
import { orm } from '../shared/orm.js';
import { Juego } from '../Producto/Juego/juego.entity.js';
import { Servicio } from '../Producto/Servicio/servicio.entity.js';
import { Complemento } from '../Producto/Complemento/complemento.entity.js';
import { FotoProducto } from '../Producto/FotoProducto/fotoProducto.entity.js';
import { Venta } from '../Venta/venta.entity.js';

type TipoProducto = 'juego' | 'servicio' | 'complemento' | 'todos';

export async function search(req: Request, res: Response) {
	try {
		const em = orm.em.fork();

		const q = (req.query.q as string)?.trim() || '';
		const tipo = ((req.query.tipo as string) || 'todos').toLowerCase() as TipoProducto;
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

		const queries: Promise<any[]>[] = [];

		if (tipo === 'juego' || tipo === 'todos') {
			const whereJuego: any = {
				...buildBaseWhere(),
				...(edadMax !== undefined ? { edadPermitida: { $lte: edadMax } } : {}),
				...(categoriaId ? { categorias: { id: categoriaId } } : {}),
			};
			queries.push(
				em.find(Juego, whereJuego, {
					populate: ['compania', 'categorias', 'fotos'],
					orderBy: { id: 'asc' },
				})
			);
		}

		if (tipo === 'servicio' || tipo === 'todos') {
			const whereServicio: any = {
				...buildBaseWhere(),
				...(categoriaId ? { categorias: { id: categoriaId } } : {}),
			};
			queries.push(
				em.find(Servicio, whereServicio, {
					populate: ['compania', 'categorias', 'fotos'],
					orderBy: { id: 'asc' },
				})
			);
		}

		if (tipo === 'complemento' || tipo === 'todos') {
			const whereComplemento: any = {
				...buildBaseWhere(),
				...(categoriaId ? { categorias: { id: categoriaId } } : {}),
			};
			queries.push(
				em.find(Complemento, whereComplemento, {
					populate: ['compania', 'categorias', 'juego', 'fotos'],
					orderBy: { id: 'asc' },
				})
			);
		}

		const results = await Promise.all(queries);

		
		type Item = {
			id: number;
			tipo: 'juego' | 'servicio' | 'complemento';
			nombre: string;
			detalle: string;
			monto: number;
			compania: { id: number; nombre: string } | null;
			categorias?: { id: number; nombre: string }[];
			// Campos específicos
			fechaLanzamiento?: Date;
			edadPermitida?: number;
			juegoRelacionado?: { id: number; nombre: string } | null;
			imageUrl?: string | null;
		};

		const items: Item[] = [];

		for (const list of results) {
			for (const r of list) {
				if (r instanceof Juego) {
					const fotos = (r as any).fotos?.toArray?.() as FotoProducto[] | undefined;
					const principal = fotos?.find(f => f.esPrincipal) ?? fotos?.[0];
					items.push({
						id: r.id!,
						tipo: 'juego',
						nombre: r.nombre,
						detalle: r.detalle,
						monto: r.monto,
						compania: r.compania ? { id: (r.compania as any).id, nombre: (r.compania as any).nombre } : null,
						categorias: (r.categorias as any)?.toArray?.().map((c: any) => ({ id: c.id, nombre: c.nombre })) ?? [],
						fechaLanzamiento: r.fechaLanzamiento,
						edadPermitida: r.edadPermitida,
						imageUrl: principal?.url ?? null,
					});
				} else if (r instanceof Servicio) {
					const fotos = (r as any).fotos?.toArray?.() as FotoProducto[] | undefined;
					const principal = fotos?.find(f => f.esPrincipal) ?? fotos?.[0];
					items.push({
						id: r.id!,
						tipo: 'servicio',
						nombre: r.nombre,
						detalle: r.detalle,
						monto: r.monto,
						compania: r.compania ? { id: (r.compania as any).id, nombre: (r.compania as any).nombre } : null,
						categorias: (r.categorias as any)?.toArray?.().map((c: any) => ({ id: c.id, nombre: c.nombre })) ?? [],
						imageUrl: principal?.url ?? null,
					});
				} else if (r instanceof Complemento) {
					const fotos = (r as any).fotos?.toArray?.() as FotoProducto[] | undefined;
					const principal = fotos?.find(f => f.esPrincipal) ?? fotos?.[0];
					items.push({
						id: r.id!,
						tipo: 'complemento',
						nombre: r.nombre,
						detalle: r.detalle,
						monto: r.monto,
						compania: r.compania ? { id: (r.compania as any).id, nombre: (r.compania as any).nombre } : null,
						categorias: (r.categorias as any)?.toArray?.().map((c: any) => ({ id: c.id, nombre: c.nombre })) ?? [],
						juegoRelacionado: r.juego ? { id: (r.juego as any).id, nombre: (r.juego as any).nombre } : null,
						imageUrl: principal?.url ?? null,
					});
				}
			}
		}

		// Aplicar paginación al resultado combinado
		const totalCount = items.length;
		const paginatedItems = items.slice(offset, offset + limit);

		res.status(200).json({
			message: 'search ok',
			page,
			limit,
			count: totalCount,
			data: paginatedItems,
		});
	} catch (error: any) {
		console.error('Search error:', error);
		res.status(500).json({ message: error.message || 'internal error' });
	}
}

type TopTipo = 'juego' | 'servicio' | 'complemento' | 'todos'

export async function topSellers(req: Request, res: Response) {
	try {
		const em = orm.em.fork()

		const tipo = ((req.query.tipo as string) || 'todos').toLowerCase() as TopTipo
		const limit = Math.min(24, Math.max(1, Number(req.query.limit) || 8))

		
		const getPrincipalUrl = (fotos?: FotoProducto[] | any) => {
			const arr: FotoProducto[] = (fotos?.toArray?.() ?? fotos ?? []) as FotoProducto[]
			const principal = arr.find(f => (f as any).esPrincipal) ?? arr[0]
			return principal ? (principal as any).url : null
		}

		
		const conn = em.getConnection()
		const results: Array<{ tipo: 'juego'|'servicio'|'complemento'; id: number; count: number }> = []

		if (tipo === 'juego' || tipo === 'todos') {
			const rows = await conn.execute<{ id: number; cnt: number }[]>(
				`SELECT juego_id AS id, COUNT(*) AS cnt FROM venta WHERE juego_id IS NOT NULL GROUP BY juego_id ORDER BY cnt DESC LIMIT ?`,
				[limit]
			)
			for (const r of rows) results.push({ tipo: 'juego', id: Number(r.id), count: Number(r.cnt) })
		}
		if (tipo === 'servicio' || tipo === 'todos') {
			const rows = await conn.execute<{ id: number; cnt: number }[]>(
				`SELECT servicio_id AS id, COUNT(*) AS cnt FROM venta WHERE servicio_id IS NOT NULL GROUP BY servicio_id ORDER BY cnt DESC LIMIT ?`,
				[limit]
			)
			for (const r of rows) results.push({ tipo: 'servicio', id: Number(r.id), count: Number(r.cnt) })
		}
		if (tipo === 'complemento' || tipo === 'todos') {
			const rows = await conn.execute<{ id: number; cnt: number }[]>(
				`SELECT complemento_id AS id, COUNT(*) AS cnt FROM venta WHERE complemento_id IS NOT NULL GROUP BY complemento_id ORDER BY cnt DESC LIMIT ?`,
				[limit]
			)
			for (const r of rows) results.push({ tipo: 'complemento', id: Number(r.id), count: Number(r.cnt) })
		}

		
		const byType = {
			juego: results.filter(r => r.tipo === 'juego'),
			servicio: results.filter(r => r.tipo === 'servicio'),
			complemento: results.filter(r => r.tipo === 'complemento'),
		}

		const items: any[] = []

		if (byType.juego.length) {
			const ids = byType.juego.map(r => r.id)
			const list = await em.find(Juego, { id: { $in: ids } }, { populate: ['compania', 'fotos'] })
			for (const r of byType.juego) {
				const p = list.find(x => x.id === r.id)
				if (!p) continue
				items.push({
					id: p.id!,
					tipo: 'juego',
					nombre: p.nombre,
					detalle: p.detalle,
					monto: p.monto,
					compania: p.compania ? { id: (p.compania as any).id, nombre: (p.compania as any).nombre } : null,
					imageUrl: getPrincipalUrl((p as any).fotos),
					count: r.count,
				})
			}
		}

		if (byType.servicio.length) {
			const ids = byType.servicio.map(r => r.id)
			const list = await em.find(Servicio, { id: { $in: ids } }, { populate: ['compania', 'fotos'] })
			for (const r of byType.servicio) {
				const p = list.find(x => x.id === r.id)
				if (!p) continue
				items.push({
					id: p.id!,
					tipo: 'servicio',
					nombre: p.nombre,
					detalle: p.detalle,
					monto: p.monto,
					compania: p.compania ? { id: (p.compania as any).id, nombre: (p.compania as any).nombre } : null,
					imageUrl: getPrincipalUrl((p as any).fotos),
					count: r.count,
				})
			}
		}

		if (byType.complemento.length) {
			const ids = byType.complemento.map(r => r.id)
			const list = await em.find(Complemento, { id: { $in: ids } }, { populate: ['fotos', 'juego'] })
			for (const r of byType.complemento) {
				const p = list.find(x => x.id === r.id)
				if (!p) continue
				items.push({
					id: p.id!,
					tipo: 'complemento',
					nombre: p.nombre,
					detalle: p.detalle,
					monto: p.monto,
					compania: null,
					imageUrl: getPrincipalUrl((p as any).fotos),
					juegoRelacionado: p.juego ? { id: (p.juego as any).id, nombre: (p.juego as any).nombre } : null,
					count: r.count,
				})
			}
		}

		
		items.sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
		const data = items.slice(0, limit)

		res.status(200).json({ message: 'top sellers', count: data.length, data })
	} catch (error: any) {
		console.error('topSellers error:', error)
		res.status(500).json({ message: error.message || 'internal error' })
	}
}

