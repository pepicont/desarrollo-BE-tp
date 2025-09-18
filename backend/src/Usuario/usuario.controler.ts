import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/orm.js";
import { Usuario } from "./usuario.entity.js";
import { AuthenticatedRequest } from "../Auth/auth.types.js";

const em = orm.em;

function sanitizeUsuarioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

async function findAll(req: Request, res: Response) {
  try {
    const usuarios = await em.find(Usuario, {});
    res.status(200).json({ message: "found all users", data: usuarios });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const usuario = await em.findOneOrFail(Usuario, { id });
    res.status(200).json({ message: "found user", data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const usuario = em.create(Usuario, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: "user created", data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const usuarioToUpdate = await em.findOneOrFail(Usuario, { id });
    em.assign(usuarioToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: "user updated", data: usuarioToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: AuthenticatedRequest, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    
    // Cargar el usuario con sus relaciones para que el cascade funcione
    const usuario = await em.findOne(Usuario, { id }, { 
      populate: ['ventas', 'resenias'] 
    });
    
    if (!usuario) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    // Eliminar el usuario y todas sus relaciones en cascada
    await em.removeAndFlush(usuario);
    res.status(200).json({ message: "Usuario y datos asociados eliminados exitosamente" });
  } catch (error: any) {
    console.error('Error al eliminar usuario:', error);
    
    // Manejar error de foreign key constraint
    if (error.message && error.message.includes('foreign key constraint fails')) {
      res.status(400).json({ 
        message: "No se puede eliminar el usuario porque tiene datos asociados que no se pueden eliminar automáticamente" 
      });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }

      const em = orm.em.fork();
      const usuario = await em.findOne(Usuario, { id: userId });
      
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' }); //Todas estas validaciones las hace porque si el
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
    } catch (error: any) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }


export { sanitizeUsuarioInput, findAll, findOne, add, update, remove, getProfile };