import { Router } from 'express';
import { search, topSellers } from './search.controller.js';
export const searchRouter = Router();
// GET /api/search
/*aca*/
/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Buscar productos (juegos, servicios, complementos)
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Texto de búsqueda
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [juego, servicio, complemento, todos]
 *         description: Tipo de producto a buscar
 *       - in: query
 *         name: companiaId
 *         schema:
 *           type: integer
 *         description: Filtrar por compañía
 *       - in: query
 *         name: categoriaId
 *         schema:
 *           type: integer
 *         description: Filtrar por categoría
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *         description: Precio máximo
 *       - in: query
 *         name: edadMax
 *         schema:
 *           type: integer
 *         description: Edad máxima permitida (solo juegos)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: search ok
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 20
 *                 count:
 *                   type: integer
 *                   example: 100
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: 'integer', example: 5 }
 *                       tipo: { type: 'string', example: 'juego' }
 *                       nombre: { type: 'string', example: 'RDR2' }
 *                       detalle: { type: 'string', example: 'Detalle de RDR2' }
 *                       monto: { type: 'number', example: 4 }
 *                       compania:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id: { type: 'integer', example: 4 }
 *                           nombre: { type: 'string', example: 'Rockstar' }
 *                       categorias:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id: { type: 'integer', example: 2 }
 *                             nombre: { type: 'string', example: 'Aventura' }
 *                       fechaLanzamiento:
 *                         type: string
 *                         format: date-time
 *                         example: '2020-10-07T03:00:00.000Z'
 *                       edadPermitida:
 *                         type: integer
 *                         example: 7
 *                       juegoRelacionado:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id: { type: 'integer', example: 1 }
 *                           nombre: { type: 'string', example: 'GTA V' }
 *                       imageUrl:
 *                         type: string
 *                         nullable: true
 *                         example: 'https://res.cloudinary.com/dbrfi383s/image/upload/juego/rdr2.jpg'
 *       500:
 *         description: Error interno
 */
searchRouter.get('/', search);
/*aca*/
/**
 * @swagger
 * /api/search/top-sellers:
 *   get:
 *     summary: Obtener productos más vendidos
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [juego, servicio, complemento, todos]
 *         description: Tipo de producto
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad máxima de resultados
 *     responses:
 *       200:
 *         description: Productos más vendidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: top sellers
 *                 count:
 *                   type: integer
 *                   example: 8
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: 'integer', example: 5 }
 *                       tipo: { type: 'string', example: 'juego' }
 *                       nombre: { type: 'string', example: 'RDR2' }
 *                       detalle: { type: 'string', example: 'Detalle de RDR2' }
 *                       monto: { type: 'number', example: 4 }
 *                       compania:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id: { type: 'integer', example: 4 }
 *                           nombre: { type: 'string', example: 'Rockstar' }
 *                       imageUrl:
 *                         type: string
 *                         nullable: true
 *                         example: 'https://res.cloudinary.com/dbrfi383s/image/upload/juego/rdr2.jpg'
 *                       count:
 *                         type: integer
 *                         example: 12
 *       500:
 *         description: Error interno
 */
searchRouter.get('/top-sellers', topSellers);
//# sourceMappingURL=search.routes.js.map