import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  sanitizeComplementoInput,
  update,
  remove,
  upload,
} from "./complemento.controler.js";
import { authenticateToken } from '../../Auth/auth.middleware.js';

export const complementoRouter = Router();

complementoRouter.get("/", findAll);
complementoRouter.get("/:id", findOne);
complementoRouter.post("/", authenticateToken as any, upload.array("fotos"), sanitizeComplementoInput, add);
complementoRouter.put("/:id", authenticateToken as any, upload.array("fotos"), sanitizeComplementoInput, update);
complementoRouter.patch("/:id", authenticateToken as any,sanitizeComplementoInput, update);
complementoRouter.delete("/:id", authenticateToken as any,remove);