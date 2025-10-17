import { Router } from "express";
import { findAll, findOne, add, sanitizeComplementoInput, update, remove, upload, } from "./complemento.controler.js";
import { authenticateAdmin } from '../../Auth/auth.middleware.js';
export const complementoRouter = Router();
/**
 * @swagger
 * /api/complemento:
 *   get:
 *     summary: Obtiene todos los complementos
 *     tags:
 *       - Complementos
 *     responses:
 *       200:
 *         description: Lista de complementos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ComplementoFindAllResponse'
 *       500:
 *         description: Error del servidor
 */
complementoRouter.get("/", findAll);
/**
 * @swagger
 * /api/complemento/{id}:
 *   get:
 *     summary: Obtiene un complemento por ID
 *     tags:
 *       - Complementos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del complemento
 *     responses:
 *       200:
 *         description: Complemento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ComplementoConVentasCountResponse'
 *       404:
 *         description: Complemento no encontrado
 *       500:
 *         description: Error del servidor
 */
complementoRouter.get("/:id", findOne);
/**
 * @swagger
 * /api/complemento:
 *   post:
 *     summary: Crea un nuevo complemento
 *     tags:
 *       - Complementos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               detalle:
 *                 type: string
 *               monto:
 *                 type: number
 *               compania:
 *                 type: integer
 *               juego:
 *                 type: integer
 *               categorias:
 *                 type: array
 *                 items:
 *                   type: integer
 *               fotos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             required:
 *               - nombre
 *               - detalle
 *               - monto
 *               - compania
 *               - juego
 *               - categorias
 *     responses:
 *       201:
 *         description: Complemento creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ComplementoCreateResponse'
 *       500:
 *         description: Error del servidor / Complemento no creado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 */
complementoRouter.post("/", authenticateAdmin, upload.array("fotos"), sanitizeComplementoInput, add);
/**
 * @swagger
 * /api/complemento/{id}:
 *   put:
 *     summary: Actualiza un complemento por ID
 *     tags:
 *       - Complementos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del complemento
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               detalle:
 *                 type: string
 *               monto:
 *                 type: number
 *               compania:
 *                 type: integer
 *               juego:
 *                 type: integer
 *               categorias:
 *                 type: array
 *                 items:
 *                   type: integer
 *               fotos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             required:
 *               - nombre
 *               - detalle
 *               - monto
 *               - compania
 *               - juego
 *               - categorias
 *     responses:
 *       200:
 *         description: Complemento actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ComplementoUpdateResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 *       500:
 *         description: Error del servidor
 */
complementoRouter.put("/:id", authenticateAdmin, upload.array("fotos"), sanitizeComplementoInput, update);
/**
 * @swagger
 * /api/complemento/{id}:
 *   delete:
 *     summary: Elimina un complemento por ID
 *     tags:
 *       - Complementos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del complemento
 *     responses:
 *       200:
 *         description: Complemento eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "complemento eliminado"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 *       500:
 *         description: Error del servidor
 */
complementoRouter.delete("/:id", authenticateAdmin, remove);
//# sourceMappingURL=complemento.routes.js.map