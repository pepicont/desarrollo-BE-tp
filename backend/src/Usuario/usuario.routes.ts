import { Router } from "express";
import { sanitizeUsuarioInput, findAll, update, remove, getProfile} from "./usuario.controler.js";
import { authenticateToken, authenticateAdmin } from "../Auth/auth.middleware.js";

export const usuarioRouter = Router()

/**
 * @swagger
 * /api/usuario/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags:
 *       - Usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: 'integer', example: 1 }
 *                 nombreUsuario: { type: 'string', example: 'pepicont' }
 *                 nombre: { type: 'string', example: 'Pepe Conti' }
 *                 mail: { type: 'string', example: 'pepe@gmail.com' }
 *                 fechaNacimiento: { type: 'string', format: 'date', example: '2000-01-01' }
 *                 fechaCreacion: { type: 'string', format: 'date-time', example: '2025-10-02T15:00:00.000Z' }
 *                 urlFoto: { type: 'string', example: 'https://...' }
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Usuario no encontrado / Error del server
 */
usuarioRouter.get('/profile',authenticateToken as any, getProfile as any)

/**
 * @swagger
 * /api/usuario:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags:
 *       - Usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: 'string', example: 'found all users' }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: 'integer', example: 1 }
 *                       nombreUsuario: { type: 'string', example: 'pepicont' }
 *                       nombre: { type: 'string', example: 'Pepe Conti' }
 *                       mail: { type: 'string', example: 'pepe@gmail.com' }
 *                       fechaNacimiento: { type: 'string', format: 'date', example: '2000-01-01' }
 *                       fechaCreacion: { type: 'string', format: 'date-time', example: '2025-10-02T15:00:00.000Z' }
 *                       urlFoto: { type: 'string', example: 'https://...' }
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 */
usuarioRouter.get('/', authenticateAdmin as any, findAll)

/**
 * @swagger
 * /api/usuario:
 *   put:
 *     summary: Actualizar usuario por ID
 *     tags:
 *       - Usuario
 *     security:
 *       - bearerAuth: []
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreUsuario: { type: 'string', example: 'pepicont' }
 *               contrasenia: { type: 'string', example: '123456' }
 *               nombre: { type: 'string', example: 'Pepe Conti' }
 *               fechaNacimiento: { type: 'string', format: 'date', example: '2000-01-01' }
 *               mail: { type: 'string', example: 'pepe@gmail.com' }
 *               tipoUsuario: { type: 'string', example: 'user' }
 *               urlFoto: { type: 'string', example: 'https://...' }
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: 'string', example: 'user updated' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: 'integer', example: 1 }
 *                     nombreUsuario: { type: 'string', example: 'pepicont' }
 *                     nombre: { type: 'string', example: 'Pepe Conti' }
 *                     mail: { type: 'string', example: 'pepe@gmail.com' }
 *                     fechaNacimiento: { type: 'string', format: 'date', example: '2000-01-01' }
 *                     fechaCreacion: { type: 'string', format: 'date-time', example: '2025-10-02T15:00:00.000Z' }
 *                     urlFoto: { type: 'string', example: 'https://...' }
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Usuario no encontrado / Error del server
 */
usuarioRouter.put('/', authenticateToken as any, sanitizeUsuarioInput, update)

/**
 * @swagger
 * /api/usuario/{id}:
 *   delete:
 *     summary: Eliminar usuario por ID (y datos asociados)
 *     tags:
 *       - Usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario y datos asociados eliminados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: 'string', example: 'Usuario y datos asociados eliminados exitosamente' }
 *       400:
 *         description: No se puede eliminar el usuario porque tiene datos asociados que no se pueden eliminar automáticamente
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 *       500:
 *         description: Usuario no encontrado / Error del server
 */
usuarioRouter.delete('/:id', authenticateAdmin as any, remove)
