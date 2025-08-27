import { orm } from "../shared/orm.js";
import { Usuario } from "./usuario.entity.js";
const em = orm.em;
function sanitizeUsuarioInput(req, res, next) {
    req.body.sanitizedInput = {
        nombreUsuario: req.body.nombreUsuario,
        contrasenia: req.body.contrasenia,
        nombre: req.body.nombre,
        fechaNacimiento: req.body.fechaNacimiento,
        fechaCreacion: req.body.fechaCreacion,
        mail: req.body.mail
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function findAll(req, res) {
    try {
        const usuarios = await em.find(Usuario, {});
        res.status(200).json({ message: "found all users", data: usuarios });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const usuario = await em.findOneOrFail(Usuario, { id });
        res.status(200).json({ message: "found user", data: usuario });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const usuario = em.create(Usuario, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: "user created", data: usuario });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const usuarioToUpdate = await em.findOneOrFail(Usuario, { id });
        em.assign(usuarioToUpdate, req.body.sanitizedInput);
        await em.flush();
        res.status(200).json({ message: "user updated", data: usuarioToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const usuario = em.getReference(Usuario, id);
        await em.removeAndFlush(usuario);
        res.status(200).json({ message: "user removed" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function getProfile(req, res) {
    try {
        // El middleware de autenticación debe haber agregado el user al request
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }
        const usuario = await em.findOne(Usuario, { id: userId });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Enviar datos del perfil sin la contraseña
        const perfil = {
            id: usuario.id,
            nombreUsuario: usuario.nombreUsuario,
            nombre: usuario.nombre,
            mail: usuario.mail,
            fechaNacimiento: usuario.fechaNacimiento,
            fechaCreacion: usuario.fechaCreacion
        };
        res.status(200).json(perfil);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeUsuarioInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=usuario.controler.js.map