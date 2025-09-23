import { Router } from 'express';
import { search, topSellers } from './search.controller.js';
export const searchRouter = Router();
// GET /api/search
searchRouter.get('/', search);
searchRouter.get('/top-sellers', topSellers);
//# sourceMappingURL=search.routes.js.map