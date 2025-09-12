import { Router } from 'express'
import { authenticateToken } from '../Auth/auth.middleware.js'
import { startSession, simulateSuccess, getStatus, startMpPreference, mpWebhook, confirmMpPayment, mpSuccessCallback, mpResult } from './checkout.controller.js'

export const checkoutRouter = Router()

// Nota: flujo simulado de pago. 
checkoutRouter.post('/start', authenticateToken as any, startSession as any)
checkoutRouter.post('/simulate-success', authenticateToken as any, simulateSuccess as any)
checkoutRouter.get('/status', authenticateToken as any, getStatus as any)
// Mercado Pago
checkoutRouter.post('/mp/start', authenticateToken as any, startMpPreference as any)
checkoutRouter.post('/mp/webhook', mpWebhook as any)
checkoutRouter.get('/mp/webhook', mpWebhook as any)
checkoutRouter.get('/mp/confirm', authenticateToken as any, confirmMpPayment as any)
// público: callback de éxito para entornos sin auto_return (frontend http)
checkoutRouter.get('/mp/success', mpSuccessCallback as any)
// público: obtener resultado de pago desde el frontend si hace falta
checkoutRouter.get('/mp/result', mpResult as any)
