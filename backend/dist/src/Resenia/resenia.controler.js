import { orm } from "../shared/orm.js";
import { Resenia } from "./resenia.entity.js";
const em = orm.em;
function sanitizeReseniaInput(req, res, next) {
    req.body.sanitizedInput = {
        usuario: req.body.usuario,
        venta: req.body.venta,
        detalle: req.body.detalle,
        puntaje: req.body.puntaje,
        fecha: req.body.fecha
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function findAll(req, res) {
    try {
        const resenias = await em.find(Resenia, {}, { populate: ['usuario', 'venta'] });
        res.status(200).json({ message: "found all reviews", data: resenias });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const resenia = await em.findOneOrFail(Resenia, { id }, { populate: ['usuario', 'venta'] });
        res.status(200).json({ message: "found review", data: resenia });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const resenia = em.create(Resenia, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: "review created", data: resenia });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const reseniaToUpdate = await em.findOneOrFail(Resenia, { id });
        em.assign(reseniaToUpdate, req.body.sanitizedInput);
        await em.flush();
        res.status(200).json({ message: "review updated", data: reseniaToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const resenia = em.getReference(Resenia, id);
        await em.removeAndFlush(resenia);
        res.status(200).json({ message: "review removed" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//NUEVA FUNCIÓN: Obtener reseñas del usuario autenticado
async function getMyResenias(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }
        const resenias = await em.find(Resenia, { usuario: userId }, { populate: ['venta.juego', 'venta.servicio', 'venta.complemento'] });
        res.status(200).json({ message: "found user reviews", data: resenias });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// Obtener reseñas por producto (juego/servicio/complemento)
async function getByProduct(req, res) {
    try {
        const tipo = String(req.params.tipo);
        const id = Number.parseInt(req.params.id);
        if (!['juego', 'servicio', 'complemento'].includes(tipo) || Number.isNaN(id)) {
            res.status(400).json({ message: 'Parámetros inválidos' });
            return;
        }
        let where;
        if (tipo === 'juego')
            where = { venta: { juego: id } };
        if (tipo === 'servicio')
            where = { venta: { servicio: id } };
        if (tipo === 'complemento')
            where = { venta: { complemento: id } };
        const resenias = await em.find(Resenia, where, {
            populate: ['usuario'],
            orderBy: { fecha: 'desc' },
        });
        // Mapear solo id y nombreUsuario del usuario
        const data = resenias.map(resenia => ({
            ...resenia,
            usuario: {
                id: resenia.usuario.id,
                nombreUsuario: resenia.usuario.nombreUsuario
            }
        }));
        res.status(200).json({ message: 'found product reviews', data });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeReseniaInput, findAll, findOne, add, update, remove, getMyResenias, getByProduct };
//# sourceMappingURL=resenia.controler.js.map