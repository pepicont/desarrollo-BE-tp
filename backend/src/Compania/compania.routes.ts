import { Router } from 'express';
import {findAll, findOne, add, sanitizeCompaniaInput, update, remove} from './compania.controler.js';

export const companiaRouter = Router();

companiaRouter.get('/', findAll);
companiaRouter.get('/:id', findOne);  //FALLA ACÁ

companiaRouter.post('/', sanitizeCompaniaInput, add); //FALLA ACÁ. Mismo error
companiaRouter.put('/:id', sanitizeCompaniaInput, update);
companiaRouter.patch('/:id', sanitizeCompaniaInput, update);
companiaRouter.delete('/:id', remove);