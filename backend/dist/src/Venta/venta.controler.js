import { Venta } from './venta.entity.js';
import { orm } from '../shared/orm.js';
const em = orm.em;
async function findAll(req, res) {
    try {
        const ventas = await em.find(Venta, {});
        res.status(200).json({ message: 'found all ventas', data: ventas });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const venta = await em.findOneOrFail(Venta, { id });
        res.status(200).json({ message: 'found venta', data: venta });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
function sanitizeVentaInput(req, res, next) {
    req.body.sanitizedInput = {
        usuario: req.body.usuario,
        complemento: req.body.complemento,
        juego: req.body.juego,
        servicio: req.body.servicio,
        fecha: req.body.fecha,
        idVenta: req.body.idVenta,
        codActivacion: req.body.codActivacion,
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
        const venta = em.create(Venta, req.body.sanitizedInput || req.body);
        await em.flush();
        res.status(201).json({ message: 'venta created', data: venta });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const ventaToUpdate = await em.findOneOrFail(Venta, { id });
        em.assign(ventaToUpdate, req.body.sanitizedInput || req.body);
        await em.flush();
        res.status(200).json({ message: 'venta updated', data: ventaToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const venta = em.getReference(Venta, id);
        await em.removeAndFlush(venta);
        res.status(200).send({ message: 'venta deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeVentaInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=venta.controler.js.map