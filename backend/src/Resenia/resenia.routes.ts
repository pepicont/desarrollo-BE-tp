import { Router } from 'express';
import {
  sanitizeReseniaInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  getMyResenias,
  getByProduct,
  checkUserReviewForPurchase,
} from './resenia.controler.js';
import { authenticateToken } from '../Auth/auth.middleware.js';

export const reseniaRouter = Router();

// NUEVA RUTA: Obtener reseñas del usuario autenticado
reseniaRouter.get('/my-resenias', authenticateToken as any, getMyResenias as any);

// NUEVA RUTA: Verificar si el usuario tiene una reseña para una compra específica
reseniaRouter.get('/check-purchase/:ventaId', authenticateToken as any, checkUserReviewForPurchase as any);

reseniaRouter.get('/', findAll);
// Reseñas por producto
reseniaRouter.get('/by-product/:tipo/:id', getByProduct as any);
reseniaRouter.get('/:id', findOne);
reseniaRouter.post('/', authenticateToken as any, sanitizeReseniaInput, add as any);
reseniaRouter.put('/:id', sanitizeReseniaInput, update);
reseniaRouter.patch('/:id', sanitizeReseniaInput, update);
reseniaRouter.delete('/:id', authenticateToken as any, remove as any);
