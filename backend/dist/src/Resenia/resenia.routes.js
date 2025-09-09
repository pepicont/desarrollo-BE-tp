import { Router } from 'express';
import { sanitizeReseniaInput, findAll, findOne, add, update, remove, getMyResenias, getByProduct, } from './resenia.controler.js';
import { authenticateToken } from '../Auth/auth.middleware.js';
export const reseniaRouter = Router();
// NUEVA RUTA: Obtener reseñas del usuario autenticado
reseniaRouter.get('/my-resenias', authenticateToken, getMyResenias);
reseniaRouter.get('/', findAll);
// Reseñas por producto
reseniaRouter.get('/by-product/:tipo/:id', getByProduct);
reseniaRouter.get('/:id', findOne);
reseniaRouter.post('/', sanitizeReseniaInput, add);
reseniaRouter.put('/:id', sanitizeReseniaInput, update);
reseniaRouter.patch('/:id', sanitizeReseniaInput, update);
reseniaRouter.delete('/:id', remove);
//# sourceMappingURL=resenia.routes.js.map