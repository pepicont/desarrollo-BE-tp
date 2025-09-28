import { orm } from "../../shared/orm.js";
import { Juego } from "./juego.entity.js";
import { Venta } from "../../Venta/venta.entity.js";
import { FotoProducto } from "../FotoProducto/fotoProducto.entity.js";
import { cloudinary } from "../../shared/cloudinary.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
const em = orm.em.fork();
function sanitizeJuegoInput(req, res, next) {
    // Normalizar categorias para aceptar tanto array como string
    let categorias = req.body.categorias;
    if (typeof categorias === "string") {
        categorias = [categorias];
    }
    if (Array.isArray(categorias)) {
        categorias = categorias.map(Number);
    }
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        detalle: req.body.detalle,
        monto: req.body.monto,
        categorias,
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
        let fotosFiles = [];
        if (req.files && Array.isArray(req.files)) {
            fotosFiles = req.files;
        }
        // Crear el juego
        const juego = em.create(Juego, req.body.sanitizedInput);
        await em.flush(); // para obtener el id
        // Subir fotos y guardar en FotoProducto
        const fotoPrincipalNombre = req.body.fotoPrincipal;
        for (const file of fotosFiles) {
            const url = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: "juego" }, (error, result) => {
                    if (error || !result)
                        return reject(error);
                    resolve(result.secure_url);
                });
                stream.end(file.buffer);
            });
            const esPrincipal = file.originalname === fotoPrincipalNombre;
            const foto = em.create(FotoProducto, {
                url,
                esPrincipal,
                juego: juego,
            });
            // Asociar la foto al juego
            juego.fotos.add(foto);
        }
        await em.flush();
        res.status(201).json({ message: "game created", data: juego });
    }
    catch (error) {
        console.error("Error al crear juego:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const juegoToUpdate = await em.findOneOrFail(Juego, { id }, { populate: ["fotos"] });
        em.assign(juegoToUpdate, req.body.sanitizedInput);
        // Procesar nuevas fotos si se enviaron
        let fotosFiles = [];
        if (req.files && Array.isArray(req.files)) {
            fotosFiles = req.files;
        }
        // Subir nuevas fotos y asociarlas
        const fotoPrincipalNombre = req.body.fotoPrincipal;
        for (const file of fotosFiles) {
            const url = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: "juego" }, (error, result) => {
                    if (error || !result)
                        return reject(error);
                    resolve(result.secure_url);
                });
                stream.end(file.buffer);
            });
            const esPrincipal = file.originalname === fotoPrincipalNombre;
            const foto = em.create(FotoProducto, {
                url,
                esPrincipal,
                juego: juegoToUpdate,
            });
            juegoToUpdate.fotos.add(foto);
        }
        // Actualizar foto principal si se envió
        if (fotoPrincipalNombre) {
            // Primero, quitar principal a todas
            for (const foto of juegoToUpdate.fotos) {
                foto.esPrincipal = false;
            }
            // Buscar la foto principal por id (preferido) o por url
            let principalFoto = null;
            for (const foto of juegoToUpdate.fotos) {
                if ((foto.id && foto.id.toString() === fotoPrincipalNombre) ||
                    (foto.url && foto.url === fotoPrincipalNombre)) {
                    principalFoto = foto;
                    break;
                }
            }
            // Si no se encuentra, marcar la última agregada como principal
            if (!principalFoto && juegoToUpdate.fotos.length > 0) {
                principalFoto = juegoToUpdate.fotos[juegoToUpdate.fotos.length - 1];
            }
            if (principalFoto) {
                principalFoto.esPrincipal = true;
            }
        }
        await em.flush();
        res.status(200).json({ message: "game updated", data: juegoToUpdate });
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
export { sanitizeJuegoInput, findAll, findOne, add, update, remove, upload };
//# sourceMappingURL=juego.controler.js.map