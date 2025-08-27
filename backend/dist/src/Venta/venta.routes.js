import { Router } from 'express';
import { sanitizeVentaInput, findAll, findOne, add, update, remove, getMyVentas } from './venta.controler.js';
import { authenticateToken } from '../Auth/auth.middleware.js';
const ventaRouter = Router();
//  NUEVA RUTA: Obtener ventas del usuario autenticado (sus compras)
ventaRouter.get('/my-ventas', authenticateToken, getMyVentas);
ventaRouter.get('/', findAll);
ventaRouter.get('/:id', findOne);
ventaRouter.post('/', sanitizeVentaInput, add);
ventaRouter.put('/:id', sanitizeVentaInput, update);
ventaRouter.patch('/:id', sanitizeVentaInput, update);
ventaRouter.delete('/:id', remove);
export { ventaRouter };
//# sourceMappingURL=venta.routes.js.map