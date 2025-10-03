import { Router } from 'express'
import { authenticateCliente } from '../Auth/auth.middleware.js'
import { startSession, simulateSuccess, getStatus, startMpPreference, mpWebhook, confirmMpPayment, mpSuccessCallback, mpResult } from './checkout.controller.js'

export const checkoutRouter = Router()

// Nota: flujo simulado de pago. 

/**
 * @swagger
 * /api/checkout/start:
 *   post:
 *     summary: Iniciar sesión de checkout simulada
 *     tags:
 *       - Checkout
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [juego, servicio, complemento]
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Sesión de checkout creada
 *         content:
 *           application/json:
 *             example:
 *               message: checkout session created (simulada)
 *               data:
 *                 sessionId: sess_abc123
 *                 status: pending
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error del servidor / Producto no encontrado
 */
checkoutRouter.post('/start', authenticateCliente as any, startSession as any)


/**
 * @swagger
 * /api/checkout/simulate-success:
 *   post:
 *     summary: Simular éxito de pago y crear venta
 *     tags:
 *       - Checkout
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pago simulado y venta creada
 *         content:
 *           application/json:
 *             example:
 *               message: pago simulado y venta creada
 *               data:
 *                 status: paid
 *                 venta: { id: 1, usuario: 1, fecha: "2025-10-03T12:00:00.000Z", codActivacion: "ACT-XXXX", juego: 1 }
 *       400:
 *         description: Sesión no válida
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Sesión no encontrada
 *       500:
 *         description: Error del servidor
 */
checkoutRouter.post('/simulate-success', authenticateCliente as any, simulateSuccess as any)


/**
 * @swagger
 * /api/checkout/status:
 *   get:
 *     summary: Obtener estado de la sesión de checkout
 *     tags:
 *       - Checkout
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado de la sesión
 *         content:
 *           application/json:
 *             example:
 *               message: checkout status
 *               data:
 *                 status: paid
 *                 ventaId: 1
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Sesión no encontrada
 *       500:
 *         description: Error del servidor
 */
checkoutRouter.get('/status', authenticateCliente as any, getStatus as any)
// Mercado Pago


/**
 * @swagger
 * /api/checkout/mp/start:
 *   post:
 *     summary: Iniciar preferencia de Mercado Pago
 *     tags:
 *       - Checkout
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [juego, servicio, complemento]
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Preferencia creada
 *         content:
 *           application/json:
 *             example:
 *               message: mp preference created
 *               data:
 *                 id: "123456789"
 *                 init_point: "https://sandbox.mercadopago.com/init"
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Mercado Pago no configurado
 */
checkoutRouter.post('/mp/start', authenticateCliente as any, startMpPreference as any)


/**
 * @swagger
 * /api/checkout/mp/webhook:
 *   post:
 *     summary: Webhook de Mercado Pago (notificación de pago)
 *     tags:
 *       - Checkout
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Notificación procesada
 */
checkoutRouter.post('/mp/webhook', mpWebhook as any)


/**
 * @swagger
 * /api/checkout/mp/webhook:
 *   get:
 *     summary: Webhook de Mercado Pago (notificación de pago, GET)
 *     tags:
 *       - Checkout
 *     responses:
 *       200:
 *         description: Notificación procesada
 */
checkoutRouter.get('/mp/webhook', mpWebhook as any)


/**
 * @swagger
 * /api/checkout/mp/confirm:
 *   get:
 *     summary: Confirmar pago de Mercado Pago
 *     tags:
 *       - Checkout
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: payment_id
 *         required: true
 *         schema:
 *           type: string
 *         example: 127952792939
 *     responses:
 *       200:
 *         description: Pago confirmado
 *         content:
 *           application/json:
 *             example:
 *               message: pago confirmado
 *               data:
 *                 status: paid
 *                 venta: { id: 1, usuario: 1, fecha: "2025-10-03T12:00:00.000Z", codActivacion: "ACT-XXXX", juego: 1 }
 *       400:
 *         description: Pago no aprobado
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Mercado Pago no configurado / Pago no encontrado
 */
checkoutRouter.get('/mp/confirm', authenticateCliente as any, confirmMpPayment as any)
// público: callback de éxito para entornos sin auto_return (frontend http)


/**
 * @swagger
 * /api/checkout/mp/success:
 *   get:
 *     summary: Callback público de éxito de Mercado Pago
 *     tags:
 *       - Checkout
 *     parameters:
 *       - in: query
 *         name: payment_id
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirección a página de éxito en frontend
 */
checkoutRouter.get('/mp/success', mpSuccessCallback as any)
// público: obtener resultado de pago desde el frontend si hace falta


/**
 * @swagger
 * /api/checkout/mp/result:
 *   get:
 *     summary: Obtener resultado de pago por payment_id
 *     tags:
 *       - Checkout
 *     parameters:
 *       - in: query
 *         name: payment_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultado de pago
 *         content:
 *           application/json:
 *             example:
 *               message: resultado de pago
 *               data:
 *                 status: paid
 *                 venta:
 *                   id: 227
 *                   usuario: 130
 *                   juego:
 *                     id: 15
 *                     nombre: Overwatch 2
 *                     detalle: Detalle de Overwatch 2
 *                     monto: 1
 *                     compania: 16
 *                     fechaLanzamiento: "2020-03-21T03:00:00.000Z"
 *                     edadPermitida: 14
 *                   complemento: null
 *                   servicio: null
 *                   fecha: "2025-10-03T21:13:41.000Z"
 *                   codActivacion: "ACT-E**********"
 *       404:
 *         description: Resultado no encontrado
 *       500:
 *         description: Error del servidor
 */
checkoutRouter.get('/mp/result', mpResult as any)
