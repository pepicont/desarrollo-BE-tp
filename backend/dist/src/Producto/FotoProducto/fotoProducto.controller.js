import { orm } from '../../shared/orm.js';
import { FotoProducto } from './fotoProducto.entity.js';
import { Juego } from '../Juego/juego.entity.js';
import { Complemento } from '../Complemento/complemento.entity.js';
import { Servicio } from '../Servicio/servicio.entity.js';
const em = orm.em;
function getEntityByTipo(tipo) {
    if (tipo === 'juego')
        return Juego;
    if (tipo === 'complemento')
        return Complemento;
    return Servicio;
}
function sanitizeFotoInput(req, _res, next) {
    const { url, esPrincipal } = req.body;
    req.body.sanitizedInput = {
        url,
        esPrincipal: !!esPrincipal,
    };
    Object.keys(req.body.sanitizedInput).forEach((k) => {
        if (req.body.sanitizedInput[k] === undefined)
            delete req.body.sanitizedInput[k];
    });
    next();
}
async function list(req, res) {
    try {
        const tipo = req.params.tipo;
        const id = Number(req.params.id);
        if (!['juego', 'complemento', 'servicio'].includes(tipo) || Number.isNaN(id)) {
            res.status(400).json({ message: 'Parámetros inválidos' });
            return;
        }
        const where = {};
        where[`${tipo}`] = id;
        const fotos = await em.find(FotoProducto, where);
        res.status(200).json({ message: 'ok', data: fotos });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function create(req, res) {
    try {
        const tipo = req.params.tipo;
        const id = Number(req.params.id);
        if (!['juego', 'complemento', 'servicio'].includes(tipo) || Number.isNaN(id)) {
            res.status(400).json({ message: 'Parámetros inválidos' });
            return;
        }
        const Entity = getEntityByTipo(tipo);
        const productRef = em.getReference(Entity, id);
        const foto = new FotoProducto();
        foto.url = req.body.sanitizedInput.url;
        foto.esPrincipal = !!req.body.sanitizedInput.esPrincipal;
        if (tipo === 'juego')
            foto.juego = productRef;
        if (tipo === 'complemento')
            foto.complemento = productRef;
        if (tipo === 'servicio')
            foto.servicio = productRef;
        // Si se marca como principal, desmarcar otras primero (misma transacción)
        await em.begin();
        try {
            if (foto.esPrincipal) {
                const where = {};
                where[`${tipo}`] = id;
                const otras = await em.find(FotoProducto, where);
                for (const f of otras) {
                    f.esPrincipal = false;
                }
            }
            await em.persistAndFlush(foto);
            await em.commit();
        }
        catch (e) {
            await em.rollback();
            throw e;
        }
        res.status(201).json({ message: 'foto creada', data: foto });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function setPrincipal(req, res) {
    try {
        const tipo = req.params.tipo;
        const id = Number(req.params.id);
        const fotoId = Number(req.params.fotoId);
        if (!['juego', 'complemento', 'servicio'].includes(tipo) || Number.isNaN(id) || Number.isNaN(fotoId)) {
            res.status(400).json({ message: 'Parámetros inválidos' });
            return;
        }
        const whereFoto = { id: fotoId };
        whereFoto[`${tipo}`] = id;
        const foto = await em.findOne(FotoProducto, whereFoto);
        if (!foto) {
            res.status(404).json({ message: 'Foto no encontrada para el producto indicado' });
            return;
        }
        await em.begin();
        try {
            const where = {};
            where[`${tipo}`] = id;
            const todas = await em.find(FotoProducto, where);
            for (const f of todas)
                f.esPrincipal = f.id === fotoId;
            await em.flush();
            await em.commit();
        }
        catch (e) {
            await em.rollback();
            throw e;
        }
        res.status(200).json({ message: 'principal actualizada' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const tipo = req.params.tipo;
        const id = Number(req.params.id);
        const fotoId = Number(req.params.fotoId);
        if (!['juego', 'complemento', 'servicio'].includes(tipo) || Number.isNaN(id) || Number.isNaN(fotoId)) {
            res.status(400).json({ message: 'Parámetros inválidos' });
            return;
        }
        const whereFoto = { id: fotoId };
        whereFoto[`${tipo}`] = id;
        const foto = await em.findOne(FotoProducto, whereFoto);
        if (!foto) {
            res.status(404).json({ message: 'Foto no encontrada para el producto indicado' });
            return;
        }
        await em.removeAndFlush(foto);
        res.status(200).json({ message: 'foto eliminada' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeFotoInput, list, create, setPrincipal, remove };
//# sourceMappingURL=fotoProducto.controller.js.map