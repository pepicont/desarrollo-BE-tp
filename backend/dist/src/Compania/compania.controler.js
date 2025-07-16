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
        const compania = em.getReference(Compania, id);
        await em.removeAndFlush(compania);
        res.status(200).send({ message: 'company class deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeCompaniaInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=compania.controler.js.map