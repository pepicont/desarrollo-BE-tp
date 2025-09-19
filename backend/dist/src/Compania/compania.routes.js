import { Router } from 'express';
import { findAll, findOne, add, sanitizeCompaniaInput, update, remove, getAllCompaniesAdmin, removeCompanyAsAdmin } from './compania.controler.js';
import { authenticateToken } from '../Auth/auth.middleware.js';
export const companiaRouter = Router();
// RUTAS DE ADMIN (deben ir ANTES de las rutas genéricas)
companiaRouter.get('/admin/all', authenticateToken, getAllCompaniesAdmin);
companiaRouter.delete('/admin/:id', authenticateToken, removeCompanyAsAdmin);
// RUTAS GENERALES
companiaRouter.get('/', findAll);
companiaRouter.get('/:id', findOne);
companiaRouter.post('/', sanitizeCompaniaInput, add);
companiaRouter.put('/:id', sanitizeCompaniaInput, update);
companiaRouter.patch('/:id', sanitizeCompaniaInput, update);
companiaRouter.delete('/:id', remove);
//# sourceMappingURL=compania.routes.js.map