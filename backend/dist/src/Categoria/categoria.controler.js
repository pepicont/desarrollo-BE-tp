import { Categoria } from './categoria.entity.js';
import { orm } from '../shared/orm.js';
const em = orm.em;
async function findAll(req, res) {
    try {
        const categorias = await em.find(Categoria, {});
        res
            .status(200)
            .json({ message: 'found all categories', data: categorias });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
function sanitizeCategoriaInput(req, res, next) {
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
        const categoria = em.create(Categoria, req.body);
        await em.flush();
        res
            .status(201)
            .json({ message: 'category created', data: categoria });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const categoriaToUpdate = await em.findOneOrFail(Categoria, { id });
        em.assign(categoriaToUpdate, req.body.sanitizedInput);
        await em.flush();
        res.status(200).json({ message: 'category updated', data: categoriaToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const categoria = await em.getReference(Categoria, id);
        await em.removeAndFlush(categoria);
        res.status(200).send({ message: 'category deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeCategoriaInput, findAll, add, update, remove };
//# sourceMappingURL=categoria.controler.js.map