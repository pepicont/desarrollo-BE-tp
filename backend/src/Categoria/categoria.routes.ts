import { Router } from 'express';
import {findAll, add, sanitizeCategoriaInput, update, remove} from './categoria.controler.js';
import { authenticateAdmin } from '../Auth/auth.middleware.js';

export const categoriaRouter = Router();

// RUTAS GENERALES
/**
 * @swagger
 * /api/categoria:
 *   get:
 *     summary: Obtiene todas las categorías
 *     tags:
 *       - Categoría
 *    security:
 *     - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "found all categories"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Categoria'
 *       401: 
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 *       500:
 *         description: Error del servidor
 */
categoriaRouter.get('/',authenticateAdmin as any, findAll);

/**
 * @swagger
 * /api/categoria:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags:
 *       - Categoría
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
 *                 example: "Deportes"
 *               detalle:
 *                 type: string
 *                 example: "Juegos de deportes"
 *             required:
 *               - nombre
 *               - detalle
 *     responses:
 *       201:
 *         description: Categoría creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaCreateResponse'
 *       401: 
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 *       500:
 *         description: Error del servidor
 */
categoriaRouter.post('/', authenticateAdmin as any, sanitizeCategoriaInput, add);

/**
 * @swagger
 * /api/categoria/{id}:
 *   put:
 *     summary: Actualiza una categoría por ID
 *     tags:
 *       - Categoría
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Deportes"
 *               detalle:
 *                 type: string
 *                 example: "Juegos de deportes actualizados"
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "category updated"
 *                 data:
 *                   $ref: '#/components/schemas/Categoria'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 *       500:
 *         description: Categoría no encontrada / Error del servidor
 */
categoriaRouter.put('/:id', authenticateAdmin as any, sanitizeCategoriaInput, update);

/**
 * @swagger
 * /api/categoria/{id}:
 *   delete:
 *     summary: Elimina una categoría por ID
 *     tags:
 *       - Categoría
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "category deleted"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 *       500:
 *         description: Categoría no encontrada / Error del servidor
 */
categoriaRouter.delete('/:id', authenticateAdmin as any, remove);