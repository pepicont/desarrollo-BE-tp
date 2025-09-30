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
            schemas: {
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
                        fotos: { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' }, url: { type: 'string', format: 'uri' }, esPrincipal: { type: 'boolean' }, juego: { type: 'integer', nullable: true, example: 1 },
                                    complemento: { type: 'integer', nullable: true, example: null },
                                    servicio: { type: 'integer', nullable: true, example: null } } } },
                    },
                    required: ['nombre', 'detalle', 'monto', 'compania', 'fechaLanzamiento', 'edadPermitida'],
                },
            },
        },
    },
    apis: ['./src/**/*.ts'], // Ajusta la ruta según tu estructura
};
export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
//# sourceMappingURL=swagger.js.map