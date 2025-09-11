import { Router } from 'express'
import { authenticateToken } from '../Auth/auth.middleware.js'
import { startSession, simulateSuccess, getStatus } from './checkout.controller.js'

export const checkoutRouter = Router()

// Nota: flujo simulado de pago. 
checkoutRouter.post('/start', authenticateToken as any, startSession as any)
checkoutRouter.post('/simulate-success', authenticateToken as any, simulateSuccess as any)
checkoutRouter.get('/status', authenticateToken as any, getStatus as any)
