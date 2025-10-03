import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  sanitizeServicioInput,
  update,
  remove,
  upload
} from "./servicio.controler.js";
import { authenticateAdmin } from '../../Auth/auth.middleware.js';

export const servicioRouter = Router();

/**
 * @swagger
 * /api/servicio:
 *   get:
 *     summary: Obtiene todos los servicios
 *     tags:
 *       - Servicios
 *     responses:
 *       200:
 *         description: Lista de servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servicio'
 *       500:
 *         description: Error del servidor
 */
servicioRouter.get("/", findAll);

/**
 * @swagger
 * /api/servicio/{id}:
 *   get:
 *     summary: Obtiene un servicio por ID
 *     tags:
 *       - Servicios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicioConVentasCount'
 *       500:
 *         description: Servicio no encontrado / Error del server
 */
servicioRouter.get("/:id", findOne);

/**
 * @swagger
 * /api/servicio:
 *   post:
 *     summary: Crea un nuevo servicio
 *     tags:
 *       - Servicios
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
 *               - categorias
 *     responses:
 *       201:
 *         description: Servicio creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicioCreateResponse'
 *       500:
 *         description: Error del servidor / Servicio no creado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 */
servicioRouter.post("/", authenticateAdmin as any, upload.array("fotos"), sanitizeServicioInput, add);

/**
 * @swagger
 * /api/servicio/{id}:
 *   put:
 *     summary: Actualiza un servicio por ID
 *     tags:
 *       - Servicios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio
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
 *               - categorias
 *     responses:
 *       200:
 *         description: Servicio actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicioUpdateResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 *       500:
 *         description: Error del servidor
 */
servicioRouter.put("/:id", authenticateAdmin as any, upload.array("fotos"), sanitizeServicioInput, update);

/**
 * @swagger
 * /api/servicio/{id}:
 *   delete:
 *     summary: Elimina un servicio por ID
 *     tags:
 *       - Servicios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio
 *     responses:
 *       200:
 *         description: Servicio eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "service removed"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, solo administradores pueden acceder a esta ruta
 *       500:
 *         description: Error del servidor
 */
servicioRouter.delete("/:id", authenticateAdmin as any, remove);
