import { FotoProducto } from "../FotoProducto/fotoProducto.entity.js";
import { cloudinary } from "../../shared/cloudinary.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import { orm } from "../../shared/orm.js";
import { Servicio } from "./servicio.entity.js";
import { Venta } from "../../Venta/venta.entity.js";
function sanitizeServicioInput(req, res, next) {
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
    const em = orm.em.fork();
    try {
        const servicios = await em.find(Servicio, {}, { populate: ["categorias", "compania", "fotos"] });
        res.status(200).json({ message: "found all services", data: servicios });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    const em = orm.em.fork();
    try {
        const id = Number.parseInt(req.params.id);
        const servicios = await em.findOneOrFail(Servicio, { id }, { populate: ["categorias", "compania", "fotos"] });
        const ventasCount = await em.count(Venta, { servicio: id });
        const serialized = JSON.parse(JSON.stringify(servicios));
        serialized.ventasCount = ventasCount;
        res.status(200).json({ message: "found service", data: serialized });
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
        // Crear el servicio
        const servicio = em.create(Servicio, req.body.sanitizedInput);
        await em.flush(); // para obtener el id
        // Subir fotos y guardar en FotoProducto
        const fotoPrincipalNombre = req.body.fotoPrincipal;
        for (const file of fotosFiles) {
            const url = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: "servicio" }, (error, result) => {
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
                servicio: servicio,
            });
            // Asociar la foto al servicio
            servicio.fotos.add(foto);
        }
        await em.flush();
        res.status(201).json({ message: "servicio created", data: servicio });
    }
    catch (error) {
        console.error("Error al crear servicio:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
}
async function update(req, res) {
    const em = orm.em.fork();
    try {
        const id = Number.parseInt(req.params.id);
        const servicioToUpdate = await em.findOneOrFail(Servicio, { id }, { populate: ["fotos"] });
        em.assign(servicioToUpdate, req.body.sanitizedInput);
        // Eliminar fotos actuales si se envía fotosAEliminar (array de IDs)
        let fotosAEliminar = req.body.fotosAEliminar;
        if (typeof fotosAEliminar === "string" && fotosAEliminar.length > 0) {
            fotosAEliminar = [fotosAEliminar];
        }
        if (Array.isArray(fotosAEliminar) && fotosAEliminar.length > 0) {
            for (const fotoId of fotosAEliminar) {
                const foto = await em.findOne(FotoProducto, { id: fotoId, servicio: servicioToUpdate });
                if (foto) {
                    // Eliminar de Cloudinary
                    try {
                        const urlParts = foto.url.split('/');
                        const fileName = urlParts[urlParts.length - 1];
                        const [publicId] = fileName.split('.');
                        await cloudinary.uploader.destroy(`servicio/${publicId}`);
                    }
                    catch (e) {
                        console.error('Error eliminando de Cloudinary:', e);
                    }
                    await em.remove(foto);
                    servicioToUpdate.fotos.remove(foto);
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
                const stream = cloudinary.uploader.upload_stream({ folder: "servicio" }, (error, result) => {
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
                servicio: servicioToUpdate,
            });
            servicioToUpdate.fotos.add(foto);
        }
        // Actualizar foto principal si se envió
        if (fotoPrincipalNombre) {
            // Primero, quitar principal a todas
            for (const foto of servicioToUpdate.fotos) {
                foto.esPrincipal = false;
            }
            // Buscar la foto principal por id (preferido) o por url
            let principalFoto = null;
            for (const foto of servicioToUpdate.fotos) {
                if ((foto.id && foto.id.toString() === fotoPrincipalNombre) ||
                    (foto.url && foto.url === fotoPrincipalNombre)) {
                    principalFoto = foto;
                    break;
                }
            }
            // Si no se encuentra, marcar la última agregada como principal
            if (!principalFoto && servicioToUpdate.fotos.length > 0) {
                principalFoto = servicioToUpdate.fotos[servicioToUpdate.fotos.length - 1];
            }
            if (principalFoto) {
                principalFoto.esPrincipal = true;
            }
        }
        await em.flush();
        res.status(200).json({ message: "service updated", data: servicioToUpdate });
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
        const fotos = await em.find(FotoProducto, { servicio: id });
        for (const foto of fotos) {
            try {
                const urlParts = foto.url.split('/');
                const fileName = urlParts[urlParts.length - 1];
                const [publicId] = fileName.split('.');
                await cloudinary.uploader.destroy(`servicio/${publicId}`);
            }
            catch (e) {
                console.error('Error eliminando de Cloudinary:', e);
            }
            await em.remove(foto);
        }
        // Eliminar ventas asociadas
        const ventas = await em.find(Venta, { servicio: id });
        for (const venta of ventas) {
            // Eliminar reseñas asociadas a la venta
            const resenias = await em.find('Resenia', { venta: venta.id });
            for (const resenia of resenias) {
                await em.remove(resenia);
            }
            await em.remove(venta);
        }
        // Eliminar el servicio
        const servicio = em.getReference(Servicio, id);
        await em.removeAndFlush(servicio);
        res.status(200).json({ message: "service removed" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeServicioInput, findAll, findOne, add, update, remove, upload };
//# sourceMappingURL=servicio.controler.js.map