import { Request, Response, NextFunction } from "express";
import { Categoria } from "../../Categoria/categoria.entity.js";
import { Compania } from "../../Compania/compania.entity.js";
import { orm } from "../../shared/orm.js";
import { Complemento } from "./complemento.entity.js";

const em = orm.em;

function sanitizeComplementoInput(
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

async function findAll(req: Request, res: Response) {
  try {
    const complementos = await em.find(
      Complemento,
      {},
      { populate: ["categorias", "compania", "juego"] }
    );
    res.status(200).json({ message: "found all complementos", data: complementos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const complementos = await em.findOneOrFail(
      Complemento,
      { id },
      { populate: ["categorias", "compania", "juego"] }
    );
    res.status(200).json({ message: "found complemento", data: complementos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const complementos = em.create(Complemento, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: "complemento created", data: complementos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const complementoToUpdate = await em.findOneOrFail(Complemento, { id });
    em.assign(complementoToUpdate, req.body.sanitizedInput);
    await em.flush();
    res
      .status(200)
      .json({ message: "complemento updated", data: complementoToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const complementos = em.getReference(Complemento, id);
    await em.removeAndFlush(complementos);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeComplementoInput, findAll, findOne, add, update, remove };