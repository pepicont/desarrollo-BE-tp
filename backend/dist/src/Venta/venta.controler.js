import { Venta } from './venta.entity.js';
import { orm } from '../shared/orm.js';
const em = orm.em;
async function findAll(req, res) {
    try {
        const ventas = await em.find(Venta, {}, { populate: ['usuario', 'complemento', 'juego', 'servicio'] });
        res.status(200).json({ message: 'found all ventas', data: ventas });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const venta = await em.findOneOrFail(Venta, { id }, { populate: ['usuario', 'complemento', 'juego', 'servicio'] });
        res.status(200).json({ message: 'found venta', data: venta });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// NUEVA FUNCIÓN: Obtener ventas del usuario autenticado (sus compras)
async function getMyVentas(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }
        const ventas = await em.find(Venta, { usuario: userId }, { populate: ['complemento.fotos', 'juego.fotos', 'servicio.fotos'] });
        res.status(200).json({ message: "found user purchases", data: ventas });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { findAll, findOne, getMyVentas };
//# sourceMappingURL=venta.controler.js.map