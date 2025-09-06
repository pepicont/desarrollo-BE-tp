import { Router } from 'express';
import { search } from './search.controller.js';
export const searchRouter = Router();
// GET /api/search
searchRouter.get('/', search);
//# sourceMappingURL=search.routes.js.map