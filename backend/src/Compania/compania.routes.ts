import { Router } from 'express';
import {findAll, findOne, add, sanitizeCompaniaInput, update, remove} from './compania.controler.js';
import { authenticateAdmin } from '../Auth/auth.middleware.js';

export const companiaRouter = Router();

// RUTAS GENERALES
/**
 * @swagger
 * /api/compania:
 *   get:
 *     summary: Obtiene todas las compañías
 *     tags:
 *       - Compañía
 *     responses:
 *       200:
 *         description: Lista de compañías
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "found all companies"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Compania'
 *       500:
 *         description: Error del servidor
 */
companiaRouter.get('/', findAll);

/**
 * @swagger
 * /api/compania/{id}:
 *   get:
 *     summary: Obtiene una compañía por ID
 *     tags:
 *       - Compañía
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compañia
 *     responses:
 *       200:
 *         description: Compañía encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "found company"
 *                 data:
 *                   $ref: '#/components/schemas/Compania'
 *       500:
 *         description: Compañía no encontrada / Error del servidor
 */
companiaRouter.get('/:id', findOne);

/**
 * @swagger
 * /api/compania:
 *   post:
 *     summary: Crea una nueva compañía
 *     tags:
 *       - Compañía
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juegos SA"
 *               detalle:
 *                 type: string
 *                 example: "Juegos de deportes"
 *             required:
 *               - nombre
 *               - detalle
 *     responses:
 *       201:
 *         description: Compañía creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompaniaCreateResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 *       500:
 *         description: Error del servidor
 */
companiaRouter.post('/', authenticateAdmin as any, sanitizeCompaniaInput, add);

/**
 * @swagger
 * /api/compania/{id}:
 *   put:
 *     summary: Actualiza una compañía por ID
 *     tags:
 *       - Compañía
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compañía
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juegos SRL"
 *               detalle:
 *                 type: string
 *                 example: "Juegos de deportes actualizados"
 *     responses:
 *       200:
 *         description: Compañía actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "compañía updated"
 *                 data:
 *                   $ref: '#/components/schemas/Compania'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 *       500:
 *         description: Compañía no encontrada / Error del servidor
 */
companiaRouter.put('/:id', authenticateAdmin as any, sanitizeCompaniaInput, update); 

/**
 * @swagger
 * /api/compania/{id}:
 *   delete:
 *     summary: Elimina una compañía por ID
 *     tags:
 *       - Compañía
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compañía
 *     responses:
 *       200:
 *         description: Compañía eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "compañía deleted"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 *       500:
 *         description: Compañía no encontrada / Error del servidor
 */
companiaRouter.delete('/:id', authenticateAdmin as any, remove);