import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticateAdmin, authenticateToken } from './auth.middleware.js';

export const authRouter = Router();
const authController = new AuthController();

// POST /api/auth/login - Iniciar sesión (ruta pública)
/* http://localhost:3000/api/auth/login */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *                 example: stefano.repositorioutn@gmail.com
 *               contrasenia:
 *                 type: string
 *                 example: "123456"
 *             required:
 *               - mail
 *               - contrasenia
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve el token JWT y datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 130
 *                     mail:
 *                       type: string
 *                       example: "stefano.repositorioutn@gmail.com"
 *                     nombre:
 *                       type: string
 *                       example: "yoooo"
 *                     tipoUsuario:
 *                       type: string
 *                       example: "cliente"
 *                     urlFoto:
 *                       type: string
 *                       format: uri
 *                       example: "https://res.cloudinary.com/dbrfi383s/image/upload/usuario/yoda.jpg"
 *       401:
 *         description: Credenciales inválidas
 *       400:
 *         description: Faltan campos
 *       500:
 *         description: Error del servidor
 */
authRouter.post('/login', (authController.login as any).bind(authController));


// POST /api/auth/register - Registrar nuevo usuario (ruta pública)
/* http://localhost:3000/api/auth/register */
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *                 example: usuario@email.com
 *               contrasenia:
 *                 type: string
 *                 example: "123456"
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               nombreUsuario:
 *                 type: string
 *                 example: "juanperez"
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *             required:
 *               - mail
 *               - contrasenia
 *               - nombre
 *               - nombreUsuario
 *               - fechaNacimiento
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 131
 *                     mail:
 *                       type: string
 *                       example: "usuario@email.com"
 *                     nombre:
 *                       type: string
 *                       example: "Juan Pérez"
 *                     tipoUsuario:
 *                       type: string
 *                       example: "cliente"
 *                     urlFoto:
 *                       type: string
 *                       format: uri
 *                       example: "https://res.cloudinary.com/dbrfi383s/image/upload/usuario/ghost.jpg"
 *       400:
 *         description: Datos inválidos o faltantes
 *       409:
 *         description: Email o nombre de usuario ya registrado
 *       500:
 *         description: Error del servidor
 */
authRouter.post('/register', (authController.register as any).bind(authController));

