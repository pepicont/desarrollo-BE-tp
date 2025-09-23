import { Compania } from './compania.entity.js';
import { orm } from '../shared/orm.js';
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
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const compania = await em.findOneOrFail(Compania, { id });
        res
            .status(200)
            .json({ message: 'found company', data: compania });
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
        em.assign(companiaToUpdate, req.body);
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
        // Eliminar todos los productos asociados primero
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
//NUEVA FUNCIÓN: Obtener todas las compañías para administradores
async function getAllCompaniesAdmin(req, res) {
    try {
        const userId = req.userId;
        const userTipo = req.userTipo;
        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }
        // Verificar que el usuario es administrador
        if (userTipo !== 'admin') {
            res.status(403).json({ message: 'No tienes permisos para acceder a esta información' });
            return;
        }
        const companias = await em.find(Compania, {}, { orderBy: { nombre: 'ASC' } });
        res.status(200).json({ message: "found all companies for admin", data: companias });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//NUEVA FUNCIÓN: Eliminar cualquier compañía como administrador
async function removeCompanyAsAdmin(req, res) {
    try {
        const userId = req.userId;
        const userTipo = req.userTipo;
        const companiaId = Number.parseInt(req.params.id);
        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }
        // Verificar que el usuario es administrador
        if (userTipo !== 'admin') {
            res.status(403).json({ message: 'No tienes permisos para eliminar compañías' });
            return;
        }
        // Cargar la compañía con todos sus productos asociados
        const compania = await em.findOneOrFail(Compania, { id: companiaId }, { populate: ['juegos', 'complementos', 'servicios'] });
        // Eliminar todos los productos asociados primero
        // Esto activará el cascade para eliminar fotos, ventas, etc.
        await em.removeAndFlush([...compania.juegos, ...compania.complementos, ...compania.servicios]);
        // Ahora eliminar la compañía
        await em.removeAndFlush(compania);
        res.status(200).json({ message: "Compañía y todos sus productos eliminados correctamente" });
    }
    catch (error) {
        console.error('Error al eliminar compañía:', error);
        res.status(500).json({ message: `Error al eliminar compañía: ${error.message}` });
    }
}
export { sanitizeCompaniaInput, findAll, findOne, add, update, remove, getAllCompaniesAdmin, removeCompanyAsAdmin };
//# sourceMappingURL=compania.controler.js.map