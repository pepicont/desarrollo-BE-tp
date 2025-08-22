import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticateToken } from './auth.middleware.js';

export const authRouter = Router();
const authController = new AuthController();

// POST /api/auth/login - Iniciar sesión (ruta pública)
/* http://localhost:3000/api/auth/login */
authRouter.post('/login', (authController.login as any).bind(authController));


// POST /api/auth/register - Registrar nuevo usuario (ruta pública)
/* http://localhost:3000/api/auth/register */
authRouter.post('/register', (authController.register as any).bind(authController));

// GET /api/auth/verify - Verificar token (ruta protegida)  
/* http://localhost:3000/api/auth/verify */
/*Esto lo que hace es verificar si el token JWT enviado en la cabecera de la petición es válido y, en caso afirmativo, recién ahí se ejecuta el verifyToken (RUTA PROTEGIDA) */
authRouter.get('/verify', authenticateToken as any, (authController.verifyToken as any).bind(authController));

/* Flujo completo de una petición:
1. Cliente envía: POST /api/auth/login
2. Express busca: authRouter.post('/login', ...)
3. Express ejecuta: authController.login()
4. Controller procesa y responde
*/
