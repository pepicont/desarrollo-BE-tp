import { orm } from "../../shared/orm.js";
import { Juego } from "./juego.entity.js";
import { Venta } from "../../Venta/venta.entity.js";
const em = orm.em;
function sanitizeJuegoInput(req, res, next) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        detalle: req.body.detalle,
        monto: req.body.monto,
        categorias: req.body.categorias,
        compania: req.body.compania,
        fechaLanzamiento: req.body.fechaLanzamiento,
        edadPermitida: req.body.edadPermitida
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
        const juegos = await em.find(Juego, {}, { populate: ["categorias", "compania", "fotos"] });
        res.status(200).json({ message: "found all games", data: juegos });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const juego = await em.findOneOrFail(Juego, { id }, { populate: ["categorias", "compania", "fotos"] });
        // Count number of sales for this game
        const ventasCount = await em.count(Venta, { juego: id });
        const serialized = JSON.parse(JSON.stringify(juego));
        serialized.ventasCount = ventasCount;
        res.status(200).json({ message: "found game", data: serialized });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const juego = em.create(Juego, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: "game created", data: juego });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const juegoToUpdate = await em.findOneOrFail(Juego, { id });
        em.assign(juegoToUpdate, req.body.sanitizedInput);
        await em.flush();
        res
            .status(200)
            .json({ message: "game updated", data: juegoToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const juego = em.getReference(Juego, id);
        await em.removeAndFlush(juego);
        res.status(200).json({ message: "game removed" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeJuegoInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=juego.controler.js.map