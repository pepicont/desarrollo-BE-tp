import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  sanitizeComplementoInput,
  update,
  remove,
} from "./complemento.controler.js";

export const complementoRouter = Router();

complementoRouter.get("/", findAll);
complementoRouter.get("/:id", findOne);
complementoRouter.post("/", sanitizeComplementoInput, add);
complementoRouter.put("/:id", sanitizeComplementoInput, update);
complementoRouter.patch("/:id", sanitizeComplementoInput, update);
complementoRouter.delete("/:id", remove);