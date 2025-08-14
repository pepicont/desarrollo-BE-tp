import { Request, Response, NextFunction } from "express";
import { Categoria } from "../../Categoria/categoria.entity.js"
import {Compania} from  "../../Compania/compania.entity.js"
import { orm } from "../../shared/orm.js";
import {Juego} from "./juego.entity.js";

const em = orm.em;

function sanitizeJuegoInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

async function findAll(req: Request, res: Response) {
  try {
    const juegos = await em.find(
      Juego,
      {},
      { populate: ["categorias", "compania"] }
    );
    res.status(200).json({ message: "found all games", data: juegos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const juego = await em.findOneOrFail(
      Juego,
      { id },
      { populate: ["categorias", "compania"] }
    );
    res.status(200).json({ message: "found game", data: juego });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const juego = em.create(Juego, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: "game created", data: juego });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const juegoToUpdate = await em.findOneOrFail(Juego, { id });
    em.assign(juegoToUpdate, req.body.sanitizedInput);
    await em.flush();
    res
      .status(200)
      .json({ message: "game updated", data: juegoToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const juego = em.getReference(Juego, id);
    await em.removeAndFlush(juego);
    res.status(200).json({ message: "game removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeJuegoInput, findAll, findOne, add, update, remove };