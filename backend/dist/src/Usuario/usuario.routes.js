import { Router } from "express";
import { sanitizeUsuarioInput, findAll, findOne, add, update, remove } from "./usuario.controler.js";
export const usuarioRouter = Router();
usuarioRouter.get('/', findAll);
usuarioRouter.post('/', sanitizeUsuarioInput, add);
usuarioRouter.get('/:id', findOne);
usuarioRouter.put('/:id', sanitizeUsuarioInput, update);
usuarioRouter.patch('/:id', sanitizeUsuarioInput, update);
usuarioRouter.delete('/:id', remove);
//# sourceMappingURL=usuario.routes.js.map