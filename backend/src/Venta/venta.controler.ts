import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from "../Auth/auth.types.js";
import { Venta } from './venta.entity.js';
import { orm } from '../shared/orm.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
	try {
				 const ventas = await em.find(Venta, {},{populate: ['usuario', 'juego','complemento','servicio']});
				 // Mapear para devolver solo los campos deseados del usuario
				 const ventasConUsuarioReducido = ventas.map(v => ({
					 ...v,
					 usuario: v.usuario ? {
						 nombre: v.usuario.nombre,
						 nombreUsuario: v.usuario.nombreUsuario,
						 mail: v.usuario.mail
					 } : null
				 }));
				 res.status(200).json({ message: 'found all ventas', data: ventasConUsuarioReducido });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
}

async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const venta = await em.findOneOrFail(Venta, { id },{populate: ['complemento','juego','servicio']});
		res.status(200).json({ message: 'found venta', data: venta });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
}


// NUEVA FUNCIÓN: Obtener ventas del usuario autenticado (sus compras)
async function getMyVentas(req: AuthenticatedRequest, res: Response): Promise<void> {
	try {
		const userId = req.user?.id;
		
		if (!userId) {
			res.status(401).json({ message: 'Usuario no autenticado' });
			return;
		}

			const ventas = await em.find(
				Venta,
				{ usuario: userId },
				{ populate: ['complemento.fotos', 'juego.fotos', 'servicio.fotos'] }
			);
		res.status(200).json({ message: "found user purchases", data: ventas });
	} catch (error: any) {
		res.status(500).json({ message: error.message });	
	}
}

export { findAll, findOne, getMyVentas };
