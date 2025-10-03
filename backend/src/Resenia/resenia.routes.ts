import { Router } from 'express';
import {
  sanitizeReseniaInput,
  add,
  update,
  remove,
  getMyResenias,
  getByProduct,
  checkUserReviewForPurchase,
  getAllResenasAdmin,
  removeAsAdmin,
} from './resenia.controler.js';
import { authenticateAdmin, authenticateCliente } from '../Auth/auth.middleware.js';

export const reseniaRouter = Router();

// NUEVA RUTA: Obtener todas las reseñas para administradores.

reseniaRouter.get('/admin/all', authenticateAdmin as any, getAllResenasAdmin as any);

// NUEVA RUTA: Eliminar reseña como administrador. 

reseniaRouter.delete('/admin/:id', authenticateAdmin as any, removeAsAdmin as any);

// NUEVA RUTA: Obtener reseñas del usuario autenticado.

reseniaRouter.get('/my-resenias', authenticateCliente as any, getMyResenias as any);

// NUEVA RUTA: Verificar si el usuario tiene una reseña para una compra específica. 

reseniaRouter.get('/check-purchase/:ventaId', authenticateCliente as any, checkUserReviewForPurchase as any);


reseniaRouter.get('/by-product/:tipo/:id', getByProduct as any);

reseniaRouter.post('/', authenticateCliente as any, sanitizeReseniaInput, add as any);

reseniaRouter.put('/:id', authenticateCliente as any, sanitizeReseniaInput, update);

reseniaRouter.delete('/:id', authenticateCliente as any, remove as any);
