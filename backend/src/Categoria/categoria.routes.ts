import { Router } from 'express';
import {findAll, findOne, add, sanitizeCategoriaInput, update, remove, getAllCategoriesAdmin, removeCategoryAsAdmin} from './categoria.controler.js';
import { authenticateToken } from '../Auth/auth.middleware.js';

export const categoriaRouter = Router();

// RUTAS DE ADMIN (deben ir ANTES de las rutas genéricas)
categoriaRouter.get('/admin/all', authenticateToken as any, getAllCategoriesAdmin as any);
categoriaRouter.delete('/admin/:id', authenticateToken as any, removeCategoryAsAdmin as any);

// RUTAS GENERALES
categoriaRouter.get('/', findAll);
categoriaRouter.get('/:id', findOne); 
categoriaRouter.post('/', sanitizeCategoriaInput, add); 
categoriaRouter.put('/:id', sanitizeCategoriaInput, update); 
categoriaRouter.patch('/:id', sanitizeCategoriaInput, update); 
categoriaRouter.delete('/:id', remove);