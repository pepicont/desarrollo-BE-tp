import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  sanitizeServicioInput,
  update,
  remove,
} from "./servicio.controler.js";

export const servicioRouter = Router();

servicioRouter.get("/", findAll);
servicioRouter.get("/:id", findOne);
servicioRouter.post("/", sanitizeServicioInput, add);
servicioRouter.put("/:id", sanitizeServicioInput, update);
servicioRouter.patch("/:id", sanitizeServicioInput, update);
servicioRouter.delete("/:id", remove);
