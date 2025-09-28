import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  sanitizeServicioInput,
  update,
  remove,
} from "./servicio.controler.js";
import { authenticateToken } from '../../Auth/auth.middleware.js';

export const servicioRouter = Router();

servicioRouter.get("/", findAll);
servicioRouter.get("/:id", findOne);
servicioRouter.post("/", authenticateToken as any,sanitizeServicioInput, add);
servicioRouter.put("/:id", authenticateToken as any, sanitizeServicioInput, update);
servicioRouter.patch("/:id", authenticateToken as any,sanitizeServicioInput, update);
servicioRouter.delete("/:id", authenticateToken as any,remove);
