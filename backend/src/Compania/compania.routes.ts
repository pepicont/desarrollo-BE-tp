import { Router } from 'express';
import {findAll, findOne, add, sanitizeCompaniaInput, update, remove} from './compania.controler.js';

export const companiaRouter = Router();

companiaRouter.get('/', findAll);
companiaRouter.get('/:id', findOne); 
companiaRouter.post('/', sanitizeCompaniaInput, add); 
companiaRouter.put('/:id', sanitizeCompaniaInput, update); 
companiaRouter.patch('/:id', sanitizeCompaniaInput, update); 
companiaRouter.delete('/:id', remove);