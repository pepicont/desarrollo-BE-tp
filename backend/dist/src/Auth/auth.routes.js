import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticateToken } from './auth.middleware.js';
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
authRouter.post('/register', authController.register.bind(authController));
// GET /api/auth/verify - Verificar token (ruta protegida)  
/* http://localhost:3000/api/auth/verify */
/*Esto lo que hace es verificar si el token JWT enviado en la cabecera de la petición es válido y, en caso afirmativo, recién ahí se ejecuta el verifyToken (RUTA PROTEGIDA) */
authRouter.get('/verify', authenticateToken, authController.verifyToken.bind(authController));
/* Flujo completo de una petición:
1. Cliente envía: POST /api/auth/login
2. Express busca: authRouter.post('/login', ...)
3. Express ejecuta: authController.login()
4. Controller procesa y responde
*/
//# sourceMappingURL=auth.routes.js.map