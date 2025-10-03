import { Router } from 'express';
import { list } from './fotoProducto.controller.js';
export const fotoProductoRouter = Router();
fotoProductoRouter.get('/:tipo/:id', list);
//# sourceMappingURL=fotoProducto.routes.js.map