import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticateToken } from './auth.middleware.js';
export const authRouter = Router();
const authController = new AuthController();
// POST /api/auth/login - Iniciar sesión (ruta pública)
/* http://localhost:3000/api/auth/login */
authRouter.post('/login', authController.login.bind(authController));
// POST /api/auth/register - Registrar nuevo usuario (ruta pública)
/* http://localhost:3000/api/auth/register */
authRouter.post('/register', authController.register.bind(authController));
// GET /api/auth/verify - Verificar token (ruta protegida)  
/* http://localhost:3000/api/auth/verify */
authRouter.get('/verify', authenticateToken, authController.verifyToken.bind(authController));
/* Flujo completo de una petición:
1. Cliente envía: POST /api/auth/login
2. Express busca: authRouter.post('/login', ...)
3. Express ejecuta: authController.login()
4. Controller procesa y responde
*/
//# sourceMappingURL=auth.routes.js.map