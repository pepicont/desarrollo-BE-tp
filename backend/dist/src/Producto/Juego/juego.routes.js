import { Router } from "express";
import { findAll, findOne, add, sanitizeJuegoInput, update, remove, upload, } from "./juego.controler.js";
import { authenticateToken } from '../../Auth/auth.middleware.js';
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
 */
juegoRouter.get("/", findAll);
juegoRouter.get("/:id", findOne);
juegoRouter.post("/", authenticateToken, upload.array("fotos"), sanitizeJuegoInput, add);
juegoRouter.put("/:id", authenticateToken, upload.array("fotos"), sanitizeJuegoInput, update);
juegoRouter.patch("/:id", authenticateToken, sanitizeJuegoInput, update);
juegoRouter.delete("/:id", authenticateToken, remove);
//# sourceMappingURL=juego.routes.js.map