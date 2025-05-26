import { Router } from 'express';
//import { /*sanitizeCharacterInput,*/ findAll, findOne /**add,update,remove */} from './compania.controler.js';
import { findAll, remove } from './compania.controler.js';
export const companiaRouter = Router();
companiaRouter.get('/', findAll);
/*companiaRouter.get('/:id', findOne);  //FALLA ACÁ

companiaRouter.post('/', sanitizeCharacterInput, add); //FALLA ACÁ. Mismo error
companiaRouter.put('/:id', sanitizeCharacterInput, update);
companiaRouter.patch('/:id', sanitizeCharacterInput, update);*/
companiaRouter.delete('/:id', remove);
//# sourceMappingURL=compania.routes.js.map