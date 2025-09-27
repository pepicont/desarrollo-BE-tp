import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  sanitizeJuegoInput,
  update,
  remove,
  upload,
} from "./juego.controler.js";

export const juegoRouter = Router();

juegoRouter.get("/", findAll);
juegoRouter.get("/:id", findOne);
juegoRouter.post("/", upload.array("fotos"), sanitizeJuegoInput, add);
juegoRouter.put("/:id", sanitizeJuegoInput, update);
juegoRouter.patch("/:id", sanitizeJuegoInput, update);
juegoRouter.delete("/:id", remove);