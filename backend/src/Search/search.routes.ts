import { Router } from 'express';
import { search, topSellers } from './search.controller.js';

export const searchRouter = Router();

// GET /api/search
searchRouter.get('/', search as any);
searchRouter.get('/top-sellers', topSellers as any);

