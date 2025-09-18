import { Router } from "express";
import { sanitizeUsuarioInput, findAll, findOne, add, update, remove, getProfile} from "./usuario.controler.js";
import { authenticateToken } from "../Auth/auth.middleware.js";

export const usuarioRouter = Router()

usuarioRouter.get('/profile',authenticateToken as any, getProfile as any)
usuarioRouter.get('/', findAll)
usuarioRouter.post('/', sanitizeUsuarioInput, add)
usuarioRouter.get('/:id', findOne)
usuarioRouter.put('/:id', sanitizeUsuarioInput, update)
usuarioRouter.patch('/:id', sanitizeUsuarioInput, update)
usuarioRouter.delete('/:id', authenticateToken as any, remove)
