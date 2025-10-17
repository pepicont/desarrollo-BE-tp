import { Compania } from './compania.entity.js';
import { orm } from '../shared/orm.js';
import { Venta } from '../Venta/venta.entity.js';
const em = orm.em;
async function findAll(req, res) {
    try {
        const companias = await em.find(Compania, {});
        res
            .status(200)
            .json({ message: 'found all companies', data: companias });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
function sanitizeCompaniaInput(req, res, next) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        detalle: req.body.detalle,
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function add(req, res) {
    try {
        const compania = em.create(Compania, req.body);
        await em.flush();
        res
            .status(201)
            .json({ message: 'company created', data: compania });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const companiaToUpdate = await em.findOneOrFail(Compania, { id });
        em.assign(companiaToUpdate, req.body.sanitizedInput);
        await em.flush();
        res.status(200).json({ message: 'company updated', data: companiaToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        // Cargar la compañía con todos sus productos asociados
        const compania = await em.findOneOrFail(Compania, { id }, { populate: ['juegos', 'complementos', 'servicios'] });
        // Recolectar todos los IDs de productos para eliminar ventas y reseñas
        const juegoIds = compania.juegos.getItems().map(j => j.id).filter(id => id !== undefined);
        const complementoIds = compania.complementos.getItems().map(c => c.id).filter(id => id !== undefined);
        const servicioIds = compania.servicios.getItems().map(s => s.id).filter(id => id !== undefined);
        // 1. Obtener todas las ventas relacionadas con estos productos
        const ventasJuegos = juegoIds.length > 0 ? await em.find(Venta, { juego: { $in: juegoIds } }) : [];
        const ventasComplementos = complementoIds.length > 0 ? await em.find(Venta, { complemento: { $in: complementoIds } }) : [];
        const ventasServicios = servicioIds.length > 0 ? await em.find(Venta, { servicio: { $in: servicioIds } }) : [];
        const todasLasVentas = [...ventasJuegos, ...ventasComplementos, ...ventasServicios];
        const ventaIds = todasLasVentas.map(v => v.id);
        // 2. Eliminar reseñas relacionadas con esas ventas PRIMERO
        if (ventaIds.length > 0) {
            await em.nativeDelete('Resenia', { venta: { $in: ventaIds } });
        }
        // 3. Eliminar ventas DESPUÉS
        if (juegoIds.length > 0) {
            await em.nativeDelete('Venta', { juego: { $in: juegoIds } });
        }
        if (complementoIds.length > 0) {
            await em.nativeDelete('Venta', { complemento: { $in: complementoIds } });
        }
        if (servicioIds.length > 0) {
            await em.nativeDelete('Venta', { servicio: { $in: servicioIds } });
        }
        // Eliminar todos los productos asociados
        await em.removeAndFlush([...compania.juegos, ...compania.complementos, ...compania.servicios]);
        // Ahora eliminar la compañía
        await em.removeAndFlush(compania);
        res.status(200).send({ message: 'Compañía y todos sus productos eliminados correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar compañía:', error);
        res.status(500).json({ message: `Error al eliminar compañía: ${error.message}` });
    }
}
export { sanitizeCompaniaInput, findAll, add, update, remove };
//# sourceMappingURL=compania.controler.js.map