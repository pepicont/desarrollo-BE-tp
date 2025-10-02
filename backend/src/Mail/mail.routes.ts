import { Router } from 'express';
import { sendMail, forgotPassword, welcome, notifyCredentialsChange, paymentConfirmation, deletedUser } from './mail.controller.js';


const mailRouter = Router();

/**
 * @swagger
 * /api/mail:
 *   post:
 *     summary: Enviar consulta por mail
 *     tags:
 *       - Mail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *               asunto:
 *                 type: string
 *               detalle:
 *                 type: string
 *             required:
 *               - mail
 *               - asunto
 *               - detalle
 *     responses:
 *       200:
 *         description: Mail enviado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mail enviado correctamente
 *       400:
 *         description: Faltan datos requeridos
 *       500:
 *         description: Error enviando mail
 */
mailRouter.post('/', sendMail as any);

/**
 * @swagger
 * /api/mail/forgot-password:
 *   post:
 *     summary: Recuperar contraseña por mail
 *     tags:
 *       - Mail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Mail enviado con la nueva contraseña
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mail enviado con la nueva contraseña
 *       400:
 *         description: Falta el email
 *       404:
 *         description: No se encontró un mail asociado a esa cuenta
 *       500:
 *         description: Error en la recuperación
 */
mailRouter.post('/forgot-password', forgotPassword as any);

/**
 * @swagger
 * /api/mail/welcome:
 *   post:
 *     summary: Enviar mail de bienvenida
 *     tags:
 *       - Mail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               nombre:
 *                 type: string
 *             required:
 *               - email
 *               - nombre
 *     responses:
 *       200:
 *         description: Mail de bienvenida enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mail de bienvenida enviado
 *       400:
 *         description: Faltan datos requeridos
 *       500:
 *         description: Error enviando mail de bienvenida
 */
mailRouter.post('/welcome', welcome as any);

/**
 * @swagger
 * /api/mail/notify-credentials-change:
 *   post:
 *     summary: Notificar cambio de credenciales
 *     tags:
 *       - Mail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               oldUsername:
 *                 type: string
 *             required:
 *               - email
 *               - oldUsername
 *     responses:
 *       200:
 *         description: Mail de notificación de cambio de credenciales enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mail de notificación de cambio de credenciales enviado
 *       400:
 *         description: Faltan datos requeridos
 *       500:
 *         description: Error enviando mail de notificación
 */
mailRouter.post('/notify-credentials-change', notifyCredentialsChange as any);

/**
 * @swagger
 * /api/mail/payment-confirmation:
 *   post:
 *     summary: Enviar mail de confirmación de compra
 *     tags:
 *       - Mail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               nombre:
 *                 type: string
 *               producto:
 *                 type: string
 *               codigo:
 *                 type: string
 *             required:
 *               - email
 *               - nombre
 *               - producto
 *               - codigo
 *     responses:
 *       200:
 *         description: Mail de confirmación de compra enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mail de confirmación de compra enviado
 *       400:
 *         description: Faltan datos requeridos
 *       500:
 *         description: Error enviando mail de confirmación de compra
 */
mailRouter.post('/payment-confirmation', paymentConfirmation as any);

/**
 * @swagger
 * /api/mail/deleted-user:
 *   post:
 *     summary: Enviar mail de cuenta eliminada
 *     tags:
 *       - Mail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *               nombreUsuario:
 *                 type: string
 *               motivo:
 *                 type: string
 *             required:
 *               - mail
 *               - nombreUsuario
 *     responses:
 *       200:
 *         description: Mail de cuenta eliminada enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mail de cuenta eliminada enviado
 *       400:
 *         description: Faltan datos requeridos
 *       500:
 *         description: Error enviando mail de cuenta eliminada
 */
mailRouter.post('/deleted-user', deletedUser as any);
export { mailRouter };