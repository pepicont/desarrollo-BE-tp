import { orm } from "../../shared/orm.js";
import { Complemento } from "./complemento.entity.js";
import { Venta } from "../../Venta/venta.entity.js";
const em = orm.em;
function sanitizeComplementoInput(req, res, next) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        detalle: req.body.detalle,
        monto: req.body.monto,
        categorias: req.body.categorias,
        compania: req.body.compania,
        juego: req.body.juego
    };
    //more checks here
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function findAll(req, res) {
    try {
        const complementos = await em.find(Complemento, {}, { populate: ["categorias", "compania", "juego", "fotos"] });
        res.status(200).json({ message: "found all complementos", data: complementos });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const complementos = await em.findOneOrFail(Complemento, { id }, { populate: ["categorias", "compania", "juego", "fotos"] });
        const ventasCount = await em.count(Venta, { complemento: id });
        const serialized = JSON.parse(JSON.stringify(complementos));
        serialized.ventasCount = ventasCount;
        res.status(200).json({ message: "found complemento", data: serialized });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const complementos = em.create(Complemento, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: "complemento created", data: complementos });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const complementoToUpdate = await em.findOneOrFail(Complemento, { id });
        em.assign(complementoToUpdate, req.body.sanitizedInput);
        await em.flush();
        res
            .status(200)
            .json({ message: "complemento updated", data: complementoToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const complementos = em.getReference(Complemento, id);
        await em.removeAndFlush(complementos);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeComplementoInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=complemento.controler.js.map