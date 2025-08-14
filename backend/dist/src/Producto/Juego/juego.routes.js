import { Router } from "express";
import { findAll, findOne, add, sanitizeJuegoInput, update, remove, } from "./juego.controler.js";
export const juegoRouter = Router();
juegoRouter.get("/", findAll);
juegoRouter.get("/:id", findOne);
juegoRouter.post("/", sanitizeJuegoInput, add);
juegoRouter.put("/:id", sanitizeJuegoInput, update);
juegoRouter.patch("/:id", sanitizeJuegoInput, update);
juegoRouter.delete("/:id", remove);
//# sourceMappingURL=juego.routes.js.map