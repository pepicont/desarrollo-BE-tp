import { Router } from "express";
import { findAll, findOne, add, sanitizeJuegoInput, update, remove, upload, } from "./juego.controler.js";
import { authenticateAdmin } from '../../Auth/auth.middleware.js';
export const juegoRouter = Router();
/**
 * @swagger
 * /api/juego:
 *   get:
 *     summary: Obtiene todos los juegos
 *     tags:
 *       - Juegos
 *     responses:
 *       200:
 *         description: Lista de juegos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Juego'
 *       500:
 *         description: Error del servidor
 */
juegoRouter.get("/", findAll);
/**
 * @swagger
 * /api/juego/{id}:
 *   get:
 *     summary: Obtiene un juego por ID
 *     tags:
 *       - Juegos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del juego
 *     responses:
 *       200:
 *         description: Juego encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JuegoConVentasCount'
 *       404:
 *         description: Juego no encontrado
 *       500:
 *         description: Error del servidor
 */
juegoRouter.get("/:id", findOne);
/**
 * @swagger
 * /api/juego:
 *   post:
 *     summary: Crea un nuevo juego
 *     tags:
 *       - Juegos
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
 *               categorias:
 *                 type: array
 *                 items:
 *                   type: integer
 *               fechaLanzamiento:
 *                 type: string
 *                 format: date-time
 *               edadPermitida:
 *                 type: integer
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
 *               - fechaLanzamiento
 *               - edadPermitida
 *               - categorias
 *     responses:
 *       201:
 *         description: Juego creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JuegoCreateResponse'
 *       500:
 *         description: Error del servidor / Juego no creado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 */
juegoRouter.post("/", authenticateAdmin, upload.array("fotos"), sanitizeJuegoInput, add);
/**
 * @swagger
 * /api/juego/{id}:
 *   put:
 *     summary: Actualiza un juego por ID
 *     tags:
 *       - Juegos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del juego
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
 *               compania_id:
 *                 type: integer
 *               categorias:
 *                 type: array
 *                 items:
 *                   type: integer
 *               fechaLanzamiento:
 *                 type: string
 *                 format: date-time
 *               edadPermitida:
 *                 type: integer
 *               fotos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             required:
 *               - nombre
 *               - detalle
 *               - monto
 *               - compania_id
 *               - fechaLanzamiento
 *               - edadPermitida
 *               - categorias
 *     responses:
 *       200:
 *         description: Juego actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JuegoUpdateResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 *       500:
 *         description: Error del servidor
 */
juegoRouter.put("/:id", authenticateAdmin, upload.array("fotos"), sanitizeJuegoInput, update);
/**
 * @swagger
 * /api/juego/{id}:
 *   delete:
 *     summary: Elimina un juego por ID
 *     tags:
 *       - Juegos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del juego
 *     responses:
 *       200:
 *         description: Juego eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "game removed"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 *       500:
 *         description: Error del servidor
 */
juegoRouter.delete("/:id", authenticateAdmin, remove);
//# sourceMappingURL=juego.routes.js.map