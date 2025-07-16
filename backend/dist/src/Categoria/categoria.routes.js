import { Router } from 'express';
import { findAll, findOne, add, sanitizeCategoriaInput, update, remove } from './categoria.controler.js';
export const categoriaRouter = Router();
categoriaRouter.get('/', findAll);
categoriaRouter.get('/:id', findOne);
categoriaRouter.post('/', sanitizeCategoriaInput, add);
categoriaRouter.put('/:id', sanitizeCategoriaInput, update);
categoriaRouter.patch('/:id', sanitizeCategoriaInput, update);
categoriaRouter.delete('/:id', remove);
//# sourceMappingURL=categoria.routes.js.map