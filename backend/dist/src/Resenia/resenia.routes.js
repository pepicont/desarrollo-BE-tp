import { Router } from 'express';
import { sanitizeReseniaInput, findAll, findOne, add, update, remove, } from './resenia.controler.js';
export const reseniaRouter = Router();
reseniaRouter.get('/', findAll);
reseniaRouter.get('/:id', findOne);
reseniaRouter.post('/', sanitizeReseniaInput, add);
reseniaRouter.put('/:id', sanitizeReseniaInput, update);
reseniaRouter.patch('/:id', sanitizeReseniaInput, update);
reseniaRouter.delete('/:id', remove);
//# sourceMappingURL=resenia.routes.js.map