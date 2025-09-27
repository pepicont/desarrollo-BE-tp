import { Request, Response, NextFunction } from "express";
import { Categoria } from "../../Categoria/categoria.entity.js"
import {Compania} from  "../../Compania/compania.entity.js"
import { orm } from "../../shared/orm.js";
import {Servicio} from "./servicio.entity.js";
import { Venta } from "../../Venta/venta.entity.js";

const em = orm.em;

function sanitizeServicioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

async function findAll(req: Request, res: Response) {
  try {
    const servicios = await em.find(
      Servicio,
      {},
      { populate: ["categorias", "compania", "fotos"] }
    );
    res.status(200).json({ message: "found all services", data: servicios });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const servicios = await em.findOneOrFail(
      Servicio,
      { id },
      { populate: ["categorias", "compania", "fotos"] }
    );
    const ventasCount = await em.count(Venta, { servicio: id });
    const serialized: any = JSON.parse(JSON.stringify(servicios));
    serialized.ventasCount = ventasCount;
    res.status(200).json({ message: "found service", data: serialized });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const servicios = em.create(Servicio, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: "servicio created", data: servicios });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const servicioToUpdate = await em.findOneOrFail(Servicio, { id });
    em.assign(servicioToUpdate, req.body.sanitizedInput);
    await em.flush();
    res
      .status(200)
      .json({ message: "service updated", data: servicioToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const servicios = em.getReference(Servicio, id);
    await em.removeAndFlush(servicios);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeServicioInput, findAll, findOne, add, update, remove };
