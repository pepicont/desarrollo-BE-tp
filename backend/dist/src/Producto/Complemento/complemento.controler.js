import { orm } from "../../shared/orm.js";
import { Complemento } from "./complemento.entity.js";
import { Venta } from "../../Venta/venta.entity.js";
import { FotoProducto } from "../FotoProducto/fotoProducto.entity.js";
import { cloudinary } from "../../shared/cloudinary.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
function sanitizeComplementoInput(req, res, next) {
    // Normalizar categorias para aceptar tanto array como string
    let categorias = req.body.categorias;
    if (typeof categorias === "string") {
        categorias = categorias.split(',').map(Number);
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
    const em = orm.em.fork();
    try {
        const complementos = await em.find(Complemento, {}, { populate: ["categorias", "compania", "juego", "fotos"] });
        res.status(200).json({ message: "found all complementos", data: complementos });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    const em = orm.em.fork();
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
    const em = orm.em.fork();
    try {
        let fotosFiles = [];
        if (req.files && Array.isArray(req.files)) {
            fotosFiles = req.files;
        }
        // Crear el complemento
        const complemento = em.create(Complemento, req.body.sanitizedInput);
        await em.flush(); // para obtener el id
        // Subir fotos y guardar en FotoProducto
        const fotoPrincipalNombre = req.body.fotoPrincipal;
        let fotosCreadas = [];
        for (const file of fotosFiles) {
            const url = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: "complemento" }, (error, result) => {
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
                complemento: complemento,
            });
            complemento.fotos.add(foto);
            fotosCreadas.push(foto);
        }
        // Si no se marcó ninguna como principal, marcar la primera
        if (fotosCreadas.length > 0 && !fotosCreadas.some(f => f.esPrincipal)) {
            fotosCreadas[0].esPrincipal = true;
        }
        await em.flush();
        res.status(201).json({ message: "complemento created", data: complemento });
    }
    catch (error) {
        console.error("Error al crear complemento:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
}
async function update(req, res) {
    const em = orm.em.fork();
    try {
        const id = Number.parseInt(req.params.id);
        const complementoToUpdate = await em.findOneOrFail(Complemento, { id }, { populate: ["fotos"] });
        em.assign(complementoToUpdate, req.body.sanitizedInput);
        // Eliminar fotos actuales si se envía fotosAEliminar (array de IDs)
        let fotosAEliminar = req.body.fotosAEliminar;
        if (typeof fotosAEliminar === "string" && fotosAEliminar.length > 0) {
            fotosAEliminar = [fotosAEliminar];
        }
        if (Array.isArray(fotosAEliminar) && fotosAEliminar.length > 0) {
            for (const fotoId of fotosAEliminar) {
                const foto = await em.findOne(FotoProducto, { id: fotoId, complemento: complementoToUpdate });
                if (foto) {
                    // Eliminar de Cloudinary
                    try {
                        const urlParts = foto.url.split('/');
                        const fileName = urlParts[urlParts.length - 1];
                        const [publicId] = fileName.split('.');
                        await cloudinary.uploader.destroy(`complemento/${publicId}`);
                    }
                    catch (e) {
                        console.error('Error eliminando de Cloudinary:', e);
                    }
                    await em.remove(foto);
                    complementoToUpdate.fotos.remove(foto);
                }
            }
        }
        // Procesar nuevas fotos si se enviaron
        let fotosFiles = [];
        if (req.files && Array.isArray(req.files)) {
            fotosFiles = req.files;
        }
        // Subir nuevas fotos y asociarlas
        const fotoPrincipalNombre = req.body.fotoPrincipal;
        for (const file of fotosFiles) {
            const url = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: "complemento" }, (error, result) => {
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
                complemento: complementoToUpdate,
            });
            complementoToUpdate.fotos.add(foto);
        }
        // Actualizar foto principal si se envió
        if (fotoPrincipalNombre) {
            // Primero, quitar principal a todas
            for (const foto of complementoToUpdate.fotos) {
                foto.esPrincipal = false;
            }
            // Buscar la foto principal por id (preferido) o por url
            let principalFoto = null;
            for (const foto of complementoToUpdate.fotos) {
                if ((foto.id && foto.id.toString() === fotoPrincipalNombre) ||
                    (foto.url && foto.url === fotoPrincipalNombre)) {
                    principalFoto = foto;
                    break;
                }
            }
            // Si no se encuentra, marcar la primera agregada como principal
            if (!principalFoto && complementoToUpdate.fotos.length > 0) {
                principalFoto = complementoToUpdate.fotos[0];
            }
            if (principalFoto) {
                principalFoto.esPrincipal = true;
            }
        }
        await em.flush();
        res.status(200).json({ message: "complemento updated", data: complementoToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    const em = orm.em.fork();
    try {
        const id = Number.parseInt(req.params.id);
        // Eliminar fotos asociadas (FotoProducto y Cloudinary)
        const fotos = await em.find(FotoProducto, { complemento: id });
        for (const foto of fotos) {
            try {
                const urlParts = foto.url.split('/');
                const fileName = urlParts[urlParts.length - 1];
                const [publicId] = fileName.split('.');
                await cloudinary.uploader.destroy(`complemento/${publicId}`);
            }
            catch (e) {
                console.error('Error eliminando de Cloudinary:', e);
            }
            await em.remove(foto);
        }
        // Eliminar ventas asociadas
        const ventas = await em.find(Venta, { complemento: id });
        for (const venta of ventas) {
            // Eliminar reseñas asociadas a la venta
            const resenias = await em.find('Resenia', { venta: venta.id });
            for (const resenia of resenias) {
                await em.remove(resenia);
            }
            await em.remove(venta);
        }
        // Eliminar el complemento
        const complemento = em.getReference(Complemento, id);
        await em.removeAndFlush(complemento);
        res.status(200).json({ message: "complemento removed" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeComplementoInput, findAll, findOne, add, update, remove, upload };
//# sourceMappingURL=complemento.controler.js.map