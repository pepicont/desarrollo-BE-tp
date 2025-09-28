import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  sanitizeComplementoInput,
  update,
  remove,
} from "./complemento.controler.js";
import { authenticateToken } from '../../Auth/auth.middleware.js';

export const complementoRouter = Router();

complementoRouter.get("/", findAll);
complementoRouter.get("/:id", findOne);
complementoRouter.post("/", authenticateToken as any,sanitizeComplementoInput, add);
complementoRouter.put("/:id", authenticateToken as any,sanitizeComplementoInput, update);
complementoRouter.patch("/:id", authenticateToken as any,sanitizeComplementoInput, update);
complementoRouter.delete("/:id", authenticateToken as any,remove);