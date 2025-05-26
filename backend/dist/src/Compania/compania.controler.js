import { companiaRepository } from './compania.repository.js';
import { Compania } from './compania.entity.js';
const repository = new companiaRepository();
function findAll(req, res) {
    res.json({ data: repository.findAll() });
}
function findOne(req, res) {
    const id = req.params.id;
    const compania = repository.findOne({ id });
    if (!compania) {
        return res.status(404).send({ message: 'Compania not found' });
    }
    res.json({ data: compania });
    return;
}
function sanitizeCharacterInput(req, res, next) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        detalle: req.body.detalle,
    };
    //more checks here
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
function add(req, res) {
    const input = req.body.sanitizedInput;
    const companiaInput = new Compania(input.nombre, input.detalle);
    const compania = repository.add(companiaInput);
    return res
        .status(201)
        .send({ message: 'Compania creada', data: compania });
}
function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const compania = repository.update(req.body.sanitizedInput);
    if (!compania) {
        return res.status(404).send({ message: 'Compania no encontrada' });
    }
    return res
        .status(200)
        .send({ message: 'Compania actualizada con exito', data: compania });
}
function remove(req, res) {
    const id = req.params.id;
    const compania = repository.delete({ id });
    if (!compania) {
        res.status(404).send({ message: 'Compania no encontrada' });
    }
    else {
        res.status(200).send({ message: 'Compania borrada con exito' });
    }
}
export { sanitizeCharacterInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=compania.controler.js.map