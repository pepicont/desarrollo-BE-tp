import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JwtPayload } from './auth.types.js';

export const authenticateToken = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // Extraer token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ 
        message: 'Token de acceso requerido',
        error: 'NO_TOKEN'
      });
    }

    // Verificar token
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(403).json({ 
            message: 'Token expirado',
            error: 'TOKEN_EXPIRED'
          });
        }
        
        return res.status(403).json({ 
          message: 'Token inválido',
          error: 'INVALID_TOKEN'
        });
      }

      // Añadir datos del usuario al request
      req.user = decoded as JwtPayload;
      next(); // Continuar al siguiente middleware/controller
    });

  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};

  // Middleware para validar solo admin
  export const authenticateAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    authenticateToken(req, res, () => {
      if (req.user?.tipoUsuario === 'admin') {
        return next();
      }
      return res.status(403).json({ message: 'Acceso solo para administradores', error: 'FORBIDDEN' });
    });
  };

  // Middleware para validar solo cliente
  export const authenticateCliente = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    authenticateToken(req, res, () => {
      if (req.user?.tipoUsuario === 'cliente') {
        return next();
      }
      return res.status(403).json({ message: 'Acceso solo para clientes', error: 'FORBIDDEN' });
    });
  };
//IGNORAR
// Middleware opcional que no falla si no hay token (útil para rutas semi-públicas)
export const optionalAuth = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // Continúa sin usuario autenticado
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
      if (!err) {
        req.user = decoded as JwtPayload;
      }
      next(); // Continúa independientemente del resultado
    });

  } catch (error) {
    next(); // Continúa en caso de error
  }
};

// Ejemplo de cómo se recibiría y verificaría una petición
// 1. Cliente envía: GET /api/auth/verify
//    Headers: Authorization: Bearer TOKEN123

// 2. authenticateToken recibe la petición

// 3. Extrae "TOKEN123" del header

// 4. jwt.verify() verifica el token

// 5. Si es válido:
//    - req.user = { id: 1, mail: "user@mail.com", nombre: "Juan" }
//    - next() → Continúa al controller

// 6. Controller recibe req con req.user ya populado
