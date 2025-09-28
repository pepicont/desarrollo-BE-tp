import { Router } from "express";
import { findAll, findOne, add, sanitizeServicioInput, update, remove, } from "./servicio.controler.js";
import { authenticateToken } from '../../Auth/auth.middleware.js';
export const servicioRouter = Router();
servicioRouter.get("/", findAll);
servicioRouter.get("/:id", findOne);
servicioRouter.post("/", authenticateToken, sanitizeServicioInput, add);
servicioRouter.put("/:id", authenticateToken, sanitizeServicioInput, update);
servicioRouter.patch("/:id", authenticateToken, sanitizeServicioInput, update);
servicioRouter.delete("/:id", authenticateToken, remove);
//# sourceMappingURL=servicio.routes.js.map