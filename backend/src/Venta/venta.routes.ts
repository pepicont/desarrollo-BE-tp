import { Router } from 'express';
import {
  findAll,
  findOne,
  getMyVentas
} from './venta.controler.js';
import { authenticateToken } from '../Auth/auth.middleware.js';

const ventaRouter = Router();

//  NUEVA RUTA: Obtener ventas del usuario autenticado (sus compras)
ventaRouter.get('/my-ventas', authenticateToken as any, getMyVentas as any);
ventaRouter.get('/', authenticateToken as any,findAll);
ventaRouter.get('/:id', findOne);

export { ventaRouter };
