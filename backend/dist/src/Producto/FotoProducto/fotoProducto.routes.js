import { Router } from 'express';
import { sanitizeFotoInput, list, create, setPrincipal, remove } from './fotoProducto.controller.js';
export const fotoProductoRouter = Router();
// GET /api/foto-producto/:tipo/:id => lista fotos de un producto
fotoProductoRouter.get('/:tipo/:id', list);
// POST /api/foto-producto/:tipo/:id => crea una foto
fotoProductoRouter.post('/:tipo/:id', sanitizeFotoInput, create);
// PUT /api/foto-producto/:tipo/:id/:fotoId/principal => marca como principal
fotoProductoRouter.put('/:tipo/:id/:fotoId/principal', setPrincipal);
// DELETE /api/foto-producto/:tipo/:id/:fotoId => elimina foto
fotoProductoRouter.delete('/:tipo/:id/:fotoId', remove);
//# sourceMappingURL=fotoProducto.routes.js.map