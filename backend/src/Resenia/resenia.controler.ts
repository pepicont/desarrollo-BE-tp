import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../Auth/auth.types.js";
import { orm } from "../shared/orm.js";
import { Resenia } from "./resenia.entity.js";

const em = orm.em;

function sanitizeReseniaInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    usuario: req.body.usuario,
    venta: req.body.venta,
    detalle: req.body.detalle,
    puntaje: req.body.puntaje,
    fecha: req.body.fecha
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
    const resenias = await em.find(Resenia, {}, { populate: ['usuario', 'venta'] });
    res.status(200).json({ message: "found all reviews", data: resenias });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const resenia = await em.findOneOrFail(Resenia, { id },{ populate: ['usuario', 'venta'] });
    res.status(200).json({ message: "found review", data: resenia });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const resenia = em.create(Resenia, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: "review created", data: resenia });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const reseniaToUpdate = await em.findOneOrFail(Resenia, { id });
    em.assign(reseniaToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: "review updated", data: reseniaToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const resenia = em.getReference(Resenia, id);
    await em.removeAndFlush(resenia);
    res.status(200).json({ message: "review removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//NUEVA FUNCIÓN: Obtener reseñas del usuario autenticado
async function getMyResenias(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const resenias = await em.find(
      Resenia,
      { usuario: userId },
      { populate: ['venta.juego', 'venta.servicio', 'venta.complemento'] }
    );

    res.status(200).json({ message: "found user reviews", data: resenias });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeReseniaInput, findAll, findOne, add, update, remove, getMyResenias };
