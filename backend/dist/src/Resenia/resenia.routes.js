import { Router } from 'express';
import { sanitizeReseniaInput, add, update, remove, getMyResenias, getByProduct, checkUserReviewForPurchase, getAllResenasAdmin, removeAsAdmin, } from './resenia.controler.js';
import { authenticateAdmin, authenticateToken, authenticateCliente } from '../Auth/auth.middleware.js';
export const reseniaRouter = Router();
// NUEVA RUTA: Obtener todas las reseñas para administradores
reseniaRouter.get('/admin/all', authenticateAdmin, getAllResenasAdmin);
// NUEVA RUTA: Eliminar reseña como administrador
reseniaRouter.delete('/admin/:id', authenticateAdmin, removeAsAdmin);
// NUEVA RUTA: Obtener reseñas del usuario autenticado
reseniaRouter.get('/my-resenias', authenticateCliente, getMyResenias);
// NUEVA RUTA: Verificar si el usuario tiene una reseña para una compra específica
reseniaRouter.get('/check-purchase/:ventaId', authenticateToken, checkUserReviewForPurchase);
reseniaRouter.get('/by-product/:tipo/:id', getByProduct);
reseniaRouter.post('/', authenticateCliente, sanitizeReseniaInput, add);
reseniaRouter.put('/:id', authenticateCliente, sanitizeReseniaInput, update);
reseniaRouter.delete('/:id', authenticateCliente, remove);
//# sourceMappingURL=resenia.routes.js.map