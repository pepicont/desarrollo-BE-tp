import { Router } from 'express';
import { authenticateToken } from '../Auth/auth.middleware.js';
import { startSession, simulateSuccess, getStatus, startMpPreference, mpWebhook, confirmMpPayment, mpSuccessCallback, mpResult } from './checkout.controller.js';
export const checkoutRouter = Router();
// Nota: flujo simulado de pago. 
checkoutRouter.post('/start', authenticateToken, startSession);
checkoutRouter.post('/simulate-success', authenticateToken, simulateSuccess);
checkoutRouter.get('/status', authenticateToken, getStatus);
// Mercado Pago
checkoutRouter.post('/mp/start', authenticateToken, startMpPreference);
checkoutRouter.post('/mp/webhook', mpWebhook);
checkoutRouter.get('/mp/webhook', mpWebhook);
checkoutRouter.get('/mp/confirm', authenticateToken, confirmMpPayment);
// público: callback de éxito para entornos sin auto_return (frontend http)
checkoutRouter.get('/mp/success', mpSuccessCallback);
// público: obtener resultado de pago desde el frontend si hace falta
checkoutRouter.get('/mp/result', mpResult);
//# sourceMappingURL=checkout.routes.js.map