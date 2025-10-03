import { Router } from 'express';
import {
  sanitizeReseniaInput,
  add,
  update,
  remove,
  getMyResenias,
  getByProduct,
  checkUserReviewForPurchase,
  getAllResenasAdmin,
  removeAsAdmin,
} from './resenia.controler.js';
import { authenticateAdmin, authenticateCliente } from '../Auth/auth.middleware.js';

export const reseniaRouter = Router();

// NUEVA RUTA: Obtener todas las reseñas para administradores.
/**
 * @swagger
 * /api/resenia/admin/all:
 *   get:
 *     summary: Obtener todas las reseñas (admin)
 *     tags:
 *       - Resenia
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las reseñas
 *         content:
 *           application/json:
 *             example:
 *               message: found all reviews for admin
 *               data:
 *                 - id: 103
 *                   usuario:
 *                     id: 7
 *                     nombreUsuario: tomasflores05
 *                     contrasenia: "$2b$10$Z4otG6oclUmni2cPygDxhORitnLQ5Ls8eMkRw67uMEVLGxmTGQsTm"
 *                     tipoUsuario: cliente
 *                     nombre: "Tomás Flores"
 *                     fechaNacimiento: "1975-11-17T03:00:00.000Z"
 *                     fechaCreacion: "2025-09-18T16:11:23.000Z"
 *                     mail: "tomasflores.05@example.com"
 *                     urlFoto: "https://res.cloudinary.com/dbrfi383s/image/upload/usuario/ghost.jpg"
 *                   venta:
 *                     id: 79
 *                     usuario: 7
 *                     juego:
 *                       id: 17
 *                       nombre: "Fortnite"
 *                       detalle: "Detalle de Fortnite"
 *                       monto: 21
 *                       compania: 19
 *                       fechaLanzamiento: "2014-04-16T03:00:00.000Z"
 *                       edadPermitida: 14
 *                     complemento: null
 *                     servicio: null
 *                     fecha: "2025-11-03T03:00:00.000Z"
 *                     codActivacion: "ACT-X3VE4U6NCNKGGN2U"
 *                   detalle: "Historia atrapante y rendimiento impecable."
 *                   puntaje: 5
 *                   fecha: "2025-12-27T03:00:00.000Z"
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: No tienes permisos
 *       500:
 *         description: Error del servidor
 */
reseniaRouter.get('/admin/all', authenticateAdmin as any, getAllResenasAdmin as any);

// NUEVA RUTA: Eliminar reseña como administrador. 
/**
 * @swagger
 * /api/resenia/admin/{id}:
 *   delete:
 *     summary: Eliminar cualquier reseña como administrador
 *     tags:
 *       - Resenia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 129
 *     responses:
 *       200:
 *         description: Reseña eliminada por admin
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Reseña no encontrada
 *       500:
 *         description: Error del servidor / Reseña no
 */
reseniaRouter.delete('/admin/:id', authenticateAdmin as any, removeAsAdmin as any);

// NUEVA RUTA: Obtener reseñas del usuario autenticado.
/**
 * @swagger
 * /api/resenia/my-resenias:
 *   get:
 *     summary: Obtener reseñas del usuario autenticado
 *     tags:
 *       - Resenia
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reseñas del usuario
 *         content:
 *           application/json:
 *             example:
 *               message: found user reviews
 *               data:
 *                 - id: 121
 *                   usuario: 130
 *                   venta:
 *                     id: 204
 *                     usuario: 130
 *                     juego:
 *                       id: 4
 *                       nombre: GTA V
 *                       detalle: Detalle de GTA V
 *                       monto: 15
 *                       compania: 3
 *                       fechaLanzamiento: "2023-06-21T03:00:00.000Z"
 *                       edadPermitida: 13
 *                       fotos:
 *                         - id: 4
 *                           url: https://res.cloudinary.com/dbrfi383s/image/upload/juego/gta_v.jpg
 *                           esPrincipal: true
 *                           juego: 4
 *                           complemento: null
 *                           servicio: null
 *                     complemento: null
 *                     servicio: null
 *                     fecha: "2025-09-19T14:15:19.000Z"
 *                     codActivacion: ACT-E82WFWRETX7L85HK
 *                   detalle: muy buenoo pero la jugabilidad, desastrosa
 *                   puntaje: 4
 *                   fecha: "2025-09-19T14:23:00.000Z"
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: No tienes permisos
 *       500:
 *         description: Error del servidor
 */
reseniaRouter.get('/my-resenias', authenticateCliente as any, getMyResenias as any);

// NUEVA RUTA: Verificar si el usuario tiene una reseña para una compra específica. 
/**
 * @swagger
 * /api/resenia/check-purchase/{ventaId}:
 *   get:
 *     summary: Verificar si el usuario tiene una reseña para una compra específica
 *     tags:
 *       - Resenia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ventaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resultado de la verificación
 *         content:
 *           application/json:
 *             example:
 *               message: Review check completed
 *               hasReview: false
 *               reseniaId: null
 *       401:
 *         description: Usuario no autenticado
 *       400:
 *         description: ID de venta inválido
 *       403:
 *         description: No tienes permisos
 *       500:
 *         description: Error del servidor
 */
reseniaRouter.get('/check-purchase/:ventaId', authenticateCliente as any, checkUserReviewForPurchase as any);

/**
 * @swagger
 * /api/resenia/by-product/{tipo}/{id}:
 *   get:
 *     summary: Obtener reseñas por producto (juego, servicio o complemento)
 *     tags:
 *       - Resenia
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *           enum: [juego, servicio, complemento]
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de reseñas del producto
 *         content:
 *           application/json:
 *             example:
 *               message: found product reviews
 *               data:
 *                 - usuario:
 *                     id: 13
 *                     nombreUsuario: diegogomez11
 *                     urlFoto: https://res.cloudinary.com/dbrfi383s/image/upload/usuario/ghost.jpg
 *                   venta:
 *                     id: 121
 *                   detalle: Multijugador muy sólido, partidas fluidas.
 *                   puntaje: 5
 *                   fecha: 2024-10-14T03:00:00.000Z
 *                   id: 22
 *               page: 1
 *               totalPages: 1
 *               total: 1
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error del servidor
 */
reseniaRouter.get('/by-product/:tipo/:id', getByProduct as any);

/**
 * @swagger
 * /api/resenia:
 *   post:
 *     summary: Crear una nueva reseña
 *     tags:
 *       - Resenia
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               venta:
 *                 type: integer
 *                 example: 203
 *               detalle:
 *                 type: string
 *                 example: string
 *               puntaje:
 *                 type: integer
 *                 example: 1
 *               fecha:
 *                 type: string
 *                 example: "2025-10-03"
 *     responses:
 *       201:
 *         description: Reseña creada
 *         content:
 *           application/json:
 *             example:
 *               message: review created
 *               data:
 *                 id: 129
 *                 usuario: 130
 *                 venta: 203
 *                 detalle: string
 *                 puntaje: 1
 *                 fecha: "2025-01-01T13:03:00.000Z"
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Solo los clientes pueden crear reseñas
 *       500:
 *         description: Error del servidor
 */
reseniaRouter.post('/', authenticateCliente as any, sanitizeReseniaInput, add as any);

/**
 * @swagger
 * /api/resenia/{id}:
 *   put:
 *     summary: Actualizar una reseña existente
 *     tags:
 *       - Resenia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 129
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               detalle:
 *                 type: string
 *                 example: string
 *               puntaje:
 *                 type: integer
 *                 example: 2
 *               fecha:
 *                 type: string
 *                 example: "2025-01-01T13:03:00.000Z"
 *     responses:
 *       200:
 *         description: Reseña actualizada
 *         content:
 *           application/json:
 *             example:
 *               message: review updated
 *               data:
 *                 id: 129
 *                 usuario: 130
 *                 venta: 203
 *                 detalle: string
 *                 puntaje: 2
 *                 fecha: "2025-01-01T13:03:00.000Z"
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: No tienes permisos para actualizar esta reseña
 *       500:
 *         description: Error del servidor / Reseña no encontrada
 */
reseniaRouter.put('/:id', authenticateCliente as any, sanitizeReseniaInput, update);

/**
 * @swagger
 * /api/resenia/{id}:
 *   delete:
 *     summary: Eliminar una reseña propia
 *     tags:
 *       - Resenia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 129
 *     responses:
 *       200:
 *         description: Reseña eliminada
 *         content:
 *           application/json:
 *             example:
 *               message: review deleted
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Reseña no encontrada
 *       500:
 *         description: Error del servidor
 */
reseniaRouter.delete('/:id', authenticateCliente as any, remove as any);
