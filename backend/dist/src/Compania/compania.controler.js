import { companiaRepository } from './compania.repository.js';
import { Compania } from './compania.entity.js';
const repository = new companiaRepository();
function findAll(req, res, next) {
    res.json({ data: repository.findAll() });
}
function findOne(req, res, next) {
    const id = req.params.id;
    const compania = repository.findOne({ id });
    if (!compania) {
        res.status(404).send({ message: 'Compania not found' });
        return;
    }
    res.json({ data: compania });
    return;
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
function add(req, res, next) {
    const input = req.body.sanitizedInput;
    const companiaInput = new Compania(input.nombre, input.detalle);
    const compania = repository.add(companiaInput);
    res.status(201).send({ message: 'Compania creada', data: compania });
}
function update(req, res, next) {
    req.body.sanitizedInput.id = req.params.id;
    const compania = repository.update(req.body.sanitizedInput);
    if (!compania) {
        res.status(404).send({ message: 'Compania no encontrada' });
        return;
    }
    res
        .status(200)
        .send({ message: 'Compania actualizada con exito', data: compania });
}
function remove(req, res, next) {
    const id = req.params.id;
    const compania = repository.delete({ id });
    if (!compania) {
        res.status(404).send({ message: 'Compania no encontrada' });
    }
    else {
        res.status(200).send({ message: 'Compania borrada con exito' });
    }
}
export { sanitizeCompaniaInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=compania.controler.js.map