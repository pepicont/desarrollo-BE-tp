import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { orm } from '../shared/orm.js';
import { Usuario } from '../Usuario/usuario.entity.js';
import { LoginRequest, RegisterRequest, LoginResponse, AuthenticatedRequest } from './auth.types.js';

class AuthController {
  
  async login(req: Request, res: Response) {
    console.log('🔍 Login request recibido:', req.body);
    try {
      const { mail, contrasenia }: LoginRequest = req.body;

      console.log('📧 Mail:', mail, '🔒 Password length:', contrasenia ? contrasenia.length : 'undefined');

      // Validar que se enviaron los datos requeridos
      if (!mail || !contrasenia) {
        console.log('❌ Faltan datos requeridos');
        return res.status(400).json({ 
          message: 'Email y contraseña son requeridos' 
        });
      }

      // Buscar usuario por mail
      const em = orm.em.fork(); //esto crea una entidad separada por cada request para que no haya interferencia entre datos de los diferentes usuarios
      const usuario = await em.findOne(Usuario, { mail: mail });

      if (!usuario) {
        return res.status(401).json({ 
          message: 'Credenciales inválidas' 
        });
      }

      // Verificar contraseña usando el método ya existente
      const isValidPassword = await usuario.verificarContrasenia(contrasenia);

      if (!isValidPassword) {
        return res.status(401).json({ 
          message: 'Credenciales inválidas' 
        });
      }

      // Verificar que el ID existe (por seguridad)
      if (!usuario.id) {
        return res.status(500).json({ 
          message: 'Error interno del servidor' 
        });
      }

      // Generar JWT
      const payload = {
        id: usuario.id, 
        mail: usuario.mail,
        nombre: usuario.nombre 
      };

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return res.status(500).json({ message: 'JWT_SECRET no configurado' });
      }

      const token = jwt.sign(
        payload,
        secret as any,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
      );

      // Respuesta exitosa
      const response: LoginResponse = {
        token,
        user: {
          id: usuario.id,
          mail: usuario.mail,
          nombre: usuario.nombre
        }
      };

      res.status(200).json(response);

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor' 
      });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { mail, contrasenia, nombre, nombreUsuario, fechaNacimiento }: RegisterRequest = req.body;

      // Validaciones básicas
      if (!mail || !contrasenia || !nombre) {
        return res.status(400).json({ 
          message: 'Email, contraseña y nombre son requeridos' 
        });
      }

      // Validar formato de email
      const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!mailRegex.test(mail)) {
        return res.status(400).json({ 
          message: 'Formato de email inválido' 
        });
      }

      // Validar longitud de contraseña
      if (contrasenia.length < 6) {
        return res.status(400).json({ 
          message: 'La contraseña debe tener al menos 6 caracteres' 
        });
      }

      // Verificar si el usuario ya existe
      const em = orm.em.fork();
      const existingUser = await em.findOne(Usuario, { mail: mail });

      if (existingUser) {
        return res.status(409).json({ 
          message: 'El usuario ya existe' 
        });
      }

      // Crear nuevo usuario con todos los campos requeridos
      const nuevoUsuario = em.create(Usuario, {
        mail: mail,
        contrasenia: contrasenia,
        nombre: nombre,
        nombreUsuario: nombreUsuario || mail.split('@')[0],
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : new Date('2000-01-01'),
        fechaCreacion: new Date()
      });

      await em.persistAndFlush(nuevoUsuario);

      // Verificar que el ID existe después de persistir
      if (!nuevoUsuario.id) {
        return res.status(500).json({ 
          message: 'Error al crear usuario' 
        });
      }

      // Generar JWT
      const payload = {
        id: nuevoUsuario.id,
        mail: nuevoUsuario.mail,
        nombre: nuevoUsuario.nombre
      };

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return res.status(500).json({ message: 'JWT_SECRET no configurado' });
      }

      const token = jwt.sign(
        payload,
        secret as any,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
      );

      // Respuesta exitosa
      const response: LoginResponse = {
        token,
        user: {
          id: nuevoUsuario.id,
          mail: nuevoUsuario.mail,
          nombre: nuevoUsuario.nombre
        }
      };

      res.status(201).json(response);

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor' 
      });
    }
  }

  // Endpoint para verificar si el token es válido
  async verifyToken(req: AuthenticatedRequest, res: Response) {
    try {
      res.status(200).json({ 
        message: 'Token válido',
        user: req.user 
      });
    } catch (error) {
      console.error('Error en verificación:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor' 
      });
    }
  }
}

export { AuthController };
