import { orm } from "../../shared/orm.js";
import { Servicio } from "./servicio.entity.js";
const em = orm.em;
function sanitizeServicioInput(req, res, next) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        detalle: req.body.detalle,
        monto: req.body.monto,
        categorias: req.body.categorias,
        compania: req.body.compania
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
        const servicios = await em.find(Servicio, {}, { populate: ["categorias", "compania"] });
        res.status(200).json({ message: "found all services", data: servicios });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const servicios = await em.findOneOrFail(Servicio, { id }, { populate: ["categorias", "compania"] });
        res.status(200).json({ message: "found service", data: servicios });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const servicios = em.create(Servicio, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: "servicio created", data: servicios });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const servicioToUpdate = await em.findOneOrFail(Servicio, { id });
        em.assign(servicioToUpdate, req.body.sanitizedInput);
        await em.flush();
        res
            .status(200)
            .json({ message: "service updated", data: servicioToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const servicios = em.getReference(Servicio, id);
        await em.removeAndFlush(servicios);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeServicioInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=servicio.controler.js.map