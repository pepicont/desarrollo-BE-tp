import { Router } from 'express';
import { AuthController } from './auth.controller.js';
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
authRouter.post('/login', authController.login.bind(authController));
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
authRouter.post('/register', authController.register.bind(authController));
// GET /api/auth/verify - Verificar token (ruta protegida)
/* http://localhost:3000/api/auth/verify */
/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verificar si el token JWT es válido
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token válido"
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
 *                     iat:
 *                       type: integer
 *                       example: 1759343066
 *                     exp:
 *                       type: integer
 *                       example: 1759947866
 *       401:
 *         description: Token inválido o no proporcionado
 *       500:
 *         description: Error del servidor
 */
authRouter.get('/verify', authenticateToken, authController.verifyToken.bind(authController));
//# sourceMappingURL=auth.routes.js.map