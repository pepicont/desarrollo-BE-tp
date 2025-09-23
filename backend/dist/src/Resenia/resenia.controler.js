import { orm } from "../shared/orm.js";
import { Resenia } from "./resenia.entity.js";
import { moderateText } from "../shared/moderation.js";
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
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }
        const detalle = req.body?.sanitizedInput?.detalle;
        if (typeof detalle === 'string' && detalle.trim().length > 0) {
            const mod = await moderateText(detalle);
            if (!mod.allowed) {
                res.status(400).json({
                    message: 'La reseña contiene contenido no permitido',
                    reasons: mod.reasons ?? [],
                });
                return;
            }
        }
        // Agregar el usuario autenticado a los datos
        const reseniaData = {
            ...req.body.sanitizedInput,
            usuario: userId
        };
        const resenia = em.create(Resenia, reseniaData);
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
        const detalle = req.body?.sanitizedInput?.detalle;
        if (typeof detalle === 'string' && detalle.trim().length > 0) {
            const mod = await moderateText(detalle);
            if (!mod.allowed) {
                res.status(400).json({
                    message: 'La reseña contiene contenido no permitido',
                    reasons: mod.reasons ?? [],
                });
                return;
            }
        }
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
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }
        // Verificar que la reseña pertenece al usuario autenticado
        const resenia = await em.findOne(Resenia, { id }, { populate: ['usuario'] });
        if (!resenia) {
            res.status(404).json({ message: 'Reseña no encontrada' });
            return;
        }
        if (resenia.usuario.id !== userId) {
            res.status(403).json({ message: 'No tienes permisos para eliminar esta reseña' });
            return;
        }
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
        const resenias = await em.find(Resenia, { usuario: userId }, { populate: ['venta.juego.fotos', 'venta.servicio.fotos', 'venta.complemento.fotos'] });
        res.status(200).json({ message: "found user reviews", data: resenias });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// Verificar si el usuario tiene una reseña para una compra específica
async function checkUserReviewForPurchase(req, res) {
    try {
        const userId = req.user?.id;
        const ventaId = Number.parseInt(req.params.ventaId);
        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }
        if (Number.isNaN(ventaId)) {
            res.status(400).json({ message: 'ID de venta inválido' });
            return;
        }
        const resenia = await em.findOne(Resenia, {
            usuario: userId,
            venta: ventaId
        });
        res.status(200).json({
            message: 'Review check completed',
            hasReview: !!resenia,
            reseniaId: resenia?.id || null
        });
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
                nombreUsuario: resenia.usuario.nombreUsuario,
                urlFoto: resenia.usuario.urlFoto
            }
        }));
        res.status(200).json({ message: 'found product reviews', data });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//NUEVA FUNCIÓN: Obtener todas las reseñas para administradores
async function getAllResenasAdmin(req, res) {
    try {
        const userId = req.user?.id;
        const userTipo = req.user?.tipoUsuario;
        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }
        // Verificar que el usuario es administrador
        if (userTipo !== 'admin') {
            res.status(403).json({ message: 'No tienes permisos para acceder a esta información' });
            return;
        }
        const resenias = await em.find(Resenia, {}, {
            populate: ['usuario', 'venta.juego', 'venta.servicio', 'venta.complemento'],
            orderBy: { fecha: 'desc' }
        });
        res.status(200).json({ message: "found all reviews for admin", data: resenias });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//NUEVA FUNCIÓN: Eliminar cualquier reseña como administrador
async function removeAsAdmin(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const userId = req.user?.id;
        const userTipo = req.user?.tipoUsuario;
        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }
        // Verificar que el usuario es administrador
        if (userTipo !== 'admin') {
            res.status(403).json({ message: 'No tienes permisos para eliminar reseñas' });
            return;
        }
        // Buscar la reseña
        const resenia = await em.findOne(Resenia, { id });
        if (!resenia) {
            res.status(404).json({ message: 'Reseña no encontrada' });
            return;
        }
        await em.removeAndFlush(resenia);
        res.status(200).json({ message: "review removed by admin" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeReseniaInput, findAll, findOne, add, update, remove, getMyResenias, getByProduct, checkUserReviewForPurchase, getAllResenasAdmin, removeAsAdmin };
//# sourceMappingURL=resenia.controler.js.map