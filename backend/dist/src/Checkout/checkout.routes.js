import { Router } from 'express';
import { authenticateToken } from '../Auth/auth.middleware.js';
import { startSession, simulateSuccess, getStatus } from './checkout.controller.js';
export const checkoutRouter = Router();
// Nota: flujo simulado de pago. En producción reemplace por integración con Mercado Pago / Stripe.
checkoutRouter.post('/start', authenticateToken, startSession);
checkoutRouter.post('/simulate-success', authenticateToken, simulateSuccess);
checkoutRouter.get('/status', authenticateToken, getStatus);
//# sourceMappingURL=checkout.routes.js.map