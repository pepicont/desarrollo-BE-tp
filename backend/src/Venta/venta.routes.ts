import { Router } from 'express';
import {
  findAll,
  findOne,
  getMyVentas
} from './venta.controler.js';
import { authenticateToken } from '../Auth/auth.middleware.js';

const ventaRouter = Router();

//  NUEVA RUTA: Obtener ventas del usuario autenticado (sus compras)
/**
 * @swagger
 * /api/venta/my-ventas:
 *   get:
 *     summary: Obtener todas las compras del usuario autenticado
 *     tags:
 *       - Venta
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compras encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: 'string', example: 'found user purchases' }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 203
 *                       usuario:
 *                         type: integer
 *                         example: 130
 *                       juego:
 *                         type: object
 *                         properties:
 *                           id: { type: 'integer', example: 5 }
 *                           nombre: { type: 'string', example: 'RDR2' }
 *                           detalle: { type: 'string', example: 'Detalle de RDR2' }
 *                           monto: { type: 'number', example: 4 }
 *                           compania: { type: 'integer', example: 4 }
 *                           fechaLanzamiento: { type: 'string', format: 'date-time', example: '2020-10-07T03:00:00.000Z' }
 *                           edadPermitida: { type: 'integer', example: 7 }
 *                           fotos:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id: { type: 'integer', example: 5 }
 *                                 url: { type: 'string', example: 'https://res.cloudinary.com/dbrfi383s/image/upload/juego/rdr2.jpg' }
 *                                 esPrincipal: { type: 'boolean', example: true }
 *                                 juego: { type: 'integer', example: 5 }
 *                                 complemento: { type: ['integer', 'null'], example: null }
 *                                 servicio: { type: ['integer', 'null'], example: null }
*                           complemento:
 *                             nullable: true
 *                             type: object
 *                             example: null
 *                           servicio:
 *                             nullable: true
 *                             type: object
 *                             example: null
 *                           fecha:
 *                             type: string
 *                             format: date-time
 *                             example: '2025-09-19T14:06:04.000Z'
 *                           codActivacion:
 *                             type: string
 *                             example: 'ACT-5GEDPPCT2FSMMNA9'
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Usuario no encontrado / Error del server
 */
ventaRouter.get('/my-ventas', authenticateToken as any, getMyVentas as any);

/**
 * @swagger
 * /api/venta:
 *   get:
 *     summary: Obtener todas las ventas
 *     tags:
 *       - Venta
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ventas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found all ventas
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       usuario:
 *                         type: object
 *                         properties:
 *                           nombre: { type: 'string', example: 'Martina Torres' }
 *                           nombreUsuario: { type: 'string', example: 'martinatorres24' }
 *                           mail: { type: 'string', example: 'martinatorres.24@example.com' }
 *                       juego:
 *                         type: object
 *                         properties:
 *                           id: { type: 'integer', example: 24 }
 *                           nombre: { type: 'string', example: 'Forza Horizon 5' }
 *                           detalle: { type: 'string', example: 'Detalle de Forza Horizon 5' }
 *                           monto: { type: 'number', example: 34 }
 *                           compania: { type: 'integer', example: 7 }
 *                           fechaLanzamiento: { type: 'string', format: 'date-time', example: '2019-02-19T03:00:00.000Z' }
 *                           edadPermitida: { type: 'integer', example: 18 }
 *                       complemento:
 *                         nullable: true
 *                         type: object
 *                         example: null
 *                       servicio:
 *                         nullable: true
 *                         type: object
 *                         example: null
 *                       fecha:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-08-16T03:00:00.000Z'
 *                       codActivacion:
 *                         type: string
 *                         example: 'ACT-NSJZN5HQZ9NW7W95'
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error del server
 */
ventaRouter.get('/', authenticateToken as any,findAll);


/**
 * @swagger
 * /api/venta/{id}:
 *   get:
 *     summary: Obtener venta por ID
 *     tags:
 *       - Venta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found venta
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     usuario:
 *                       type: integer
 *                       example: 26
 *                     juego:
 *                       type: object
 *                       properties:
 *                         id: { type: integer, example: 24 }
 *                         nombre: { type: string, example: 'Forza Horizon 5' }
 *                         detalle: { type: string, example: 'Detalle de Forza Horizon 5' }
 *                         monto: { type: number, example: 34 }
 *                         compania: { type: integer, example: 7 }
 *                         fechaLanzamiento: { type: string, format: date-time, example: '2019-02-19T03:00:00.000Z' }
 *                         edadPermitida: { type: integer, example: 18 }
 *                     complemento:
 *                       nullable: true
 *                       type: object
 *                       example: null
 *                     servicio:
 *                       nullable: true
 *                       type: object
 *                       example: null
 *                     fecha:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-08-16T03:00:00.000Z'
 *                     codActivacion:
 *                       type: string
 *                       example: 'ACT-NSJZN5HQZ9NW7W95'
 *       500:
 *         description: Venta no encontrada / Error del server
 */
ventaRouter.get('/:id', findOne);


export { ventaRouter };
