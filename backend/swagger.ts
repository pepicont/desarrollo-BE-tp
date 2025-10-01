import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Portal Videojuegos',
      version: '1.0.0',
      description: 'Documentación de la API',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Compania: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Juegos SA' },
            detalle: { type: 'string', example: 'Juegos de deportes' }
          },
          required: ['nombre', 'detalle']
        },
        CompaniaCreateResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'company created' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 26 },
                juegos: { type: 'array', items: {}, example: [] },
                complementos: { type: 'array', items: {}, example: [] },
                servicios: { type: 'array', items: {}, example: [] },
                nombre: { type: 'string', example: 'Juegos SA' },
                detalle: { type: 'string', example: 'Juegos de deportes' }
              }
            }
          }
        },
        CompaniaUpdateResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'company updated' },
            data: { $ref: '#/components/schemas/Compania' }
          }
        },
        CategoriaCreateResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'category created' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 24 },
                juegos: { type: 'array', items: {}, example: [] },
                complementos: { type: 'array', items: {}, example: [] },
                servicios: { type: 'array', items: {}, example: [] },
                nombre: { type: 'string', example: 'Deportes' },
                detalle: { type: 'string', example: 'Juegos de deportesss' }
              }
            }
          }
        },
        JuegoCreateResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'game created' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 61 },
                complementos: { type: 'array', items: {}, example: [] },
                categorias: { type: 'array', items: { type: 'integer' }, example: [1] },
                ventas: { type: 'array', items: {}, example: [] },
                fotos: { type: 'array', items: {}, example: [] },
                nombre: { type: 'string', example: 'string' },
                detalle: { type: 'string', example: 'string' },
                monto: { type: 'string', example: '12' },
                compania: { type: 'string', example: '1' },
                fechaLanzamiento: { type: 'string', format: 'date-time', example: '2025-10-01T18:05:39.280Z' },
                edadPermitida: { type: 'string', example: '18' }
              }
            }
          }
        },
        Categoria: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Deportes' },
            detalle: { type: 'string', example: 'Juegos de deportes' },
          },
          required: ['nombre', 'detalle']
        },
        Juego: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'FIFA 24' },
            detalle: { type: 'string', example: 'Juego de fútbol' },
            monto: { type: 'number', example: 59.99 },
            compania: { type: 'object', properties: { id: { type: 'integer' }, nombre: { type: 'string' }, detalle: { type: 'string' } } },
            fechaLanzamiento: { type: 'string', format: 'date-time', example: '2025-09-30T00:00:00Z' },
            edadPermitida: { type: 'integer', example: 18 },
            categorias: { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' }, nombre: { type: 'string' }, detalle: { type: 'string' } } } },
            fotos: { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' }, url: { type: 'string', format: 'uri' }, esPrincipal: { type: 'boolean' },juego: { type: 'integer', nullable: true, example: 1 },
              complemento: { type: 'integer', nullable: true, example: null },
              servicio: { type: 'integer', nullable: true, example: null } } } },
          },
          required: ['nombre', 'detalle', 'monto', 'compania', 'fechaLanzamiento', 'edadPermitida', 'categorias'],
        },
        JuegoUpdateResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'game updated' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 63 },
                nombre: { type: 'string', example: 'string' },
                detalle: { type: 'string', example: 'string' },
                monto: { type: 'number', example: 0 },
                compania: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    nombre: { type: 'string', example: 'EA' },
                    detalle: { type: 'string', example: 'Compañía EA' }
                  }
                },
                fechaLanzamiento: { type: 'string', format: 'date-time', example: '2025-10-01T18:25:11.838Z' },
                edadPermitida: { type: 'integer', example: 18 },
                categorias: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      nombre: { type: 'string', example: 'Deportes' },
                      detalle: { type: 'string', example: 'Juegos de deportes' }
                    }
                  }
                },
                fotos: { type: 'array', items: {}, example: [] }
              }
            }
          }
        },
        JuegoConVentasCount: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'FIFA 24' },
            detalle: { type: 'string', example: 'Juego de fútbol' },
            monto: { type: 'number', example: 59.99 },
            compania: { type: 'object', properties: { id: { type: 'integer' }, nombre: { type: 'string' }, detalle: { type: 'string' } } },
            fechaLanzamiento: { type: 'string', format: 'date-time', example: '2025-09-30T00:00:00Z' },
            edadPermitida: { type: 'integer', example: 18 },
            categorias: { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' }, nombre: { type: 'string' }, detalle: { type: 'string' } } } },
            fotos: { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' }, url: { type: 'string', format: 'uri' }, esPrincipal: { type: 'boolean' },juego: { type: 'integer', nullable: true, example: 1 },
              complemento: { type: 'integer', nullable: true, example: null },
              servicio: { type: 'integer', nullable: true, example: null } } } },
              ventasCount: { type: 'integer', example: 150 },
          },
          required: ['nombre', 'detalle', 'monto', 'compania', 'fechaLanzamiento', 'edadPermitida', 'categorias', 'ventasCount'],
        },
      },
    },
  },
  apis: ['./src/**/*.ts'], // Ajusta la ruta según tu estructura
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };