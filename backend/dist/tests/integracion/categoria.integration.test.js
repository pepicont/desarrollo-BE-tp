import 'reflect-metadata';
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi, afterEach } from 'vitest';
import request from 'supertest';
vi.mock('../../src/shared/orm.js', async () => {
    const { MikroORM } = await import('@mikro-orm/core');
    const { MySqlDriver } = await import('@mikro-orm/mysql');
    const { TsMorphMetadataProvider } = await import('@mikro-orm/reflection');
    const { Categoria } = await import('../../src/Categoria/categoria.entity.js');
    const { Compania } = await import('../../src/Compania/compania.entity.js');
    const { Servicio } = await import('../../src/Producto/Servicio/servicio.entity.js');
    const { Juego } = await import('../../src/Producto/Juego/juego.entity.js');
    const { Complemento } = await import('../../src/Producto/Complemento/complemento.entity.js');
    const { Usuario } = await import('../../src/Usuario/usuario.entity.js');
    const { Venta } = await import('../../src/Venta/venta.entity.js');
    const { Resenia } = await import('../../src/Resenia/resenia.entity.js');
    const { FotoProducto } = await import('../../src/Producto/FotoProducto/fotoProducto.entity.js');
    const DB_HOST = process.env.DB_HOST || 'localhost';
    const DB_PORT = Number(process.env.DB_PORT || 3307);
    const DB_USER = process.env.DB_USER || 'dsw';
    const DB_PASSWORD = process.env.DB_PASSWORD || 'dsw';
    const DB_NAME = process.env.DB_NAME || 'portalvideojuegos';
    const NODE_ENV = process.env.NODE_ENV ?? 'development';
    const isProd = NODE_ENV === 'production';
    const orm = await MikroORM.init({
        entities: [
            Categoria,
            Compania,
            Servicio,
            Juego,
            Complemento,
            Usuario,
            Venta,
            Resenia,
            FotoProducto
        ],
        entitiesTs: [
            Categoria,
            Compania,
            Servicio,
            Juego,
            Complemento,
            Usuario,
            Venta,
            Resenia,
            FotoProducto
        ],
        metadataProvider: TsMorphMetadataProvider,
        dbName: DB_NAME,
        driver: MySqlDriver,
        clientUrl: `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
        debug: !isProd,
        schemaGenerator: {
            disableForeignKeys: !isProd,
            createForeignKeyConstraints: true,
            ignoreSchema: []
        }
    });
    const syncSchema = async () => {
        const generator = orm.getSchemaGenerator();
        await generator.updateSchema();
    };
    return { orm, syncSchema };
});
import express from 'express';
import { RequestContext } from '@mikro-orm/core';
import { categoriaRouter } from '../../src/Categoria/categoria.routes.js';
import { authRouter } from '../../src/Auth/auth.routes.js';
import { orm, syncSchema } from '../../src/shared/orm.js';
import { Categoria } from '../../src/Categoria/categoria.entity.js';
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
app.use('/api/auth', authRouter);
app.use('/api/categoria', categoriaRouter);
describe('Integration: Categoria CRUD', () => {
    let adminToken;
    const testCategoryName = 'Categoria Test Integration';
    beforeAll(async () => {
        await syncSchema();
        // Aseguramos que exista un secreto JWT para que el login funcione
        if (!process.env.JWT_SECRET) {
            process.env.JWT_SECRET = 'test-secret';
        }
        // Autenticar como admin para obtener token
        // Se utiliza el usuario admin ya cargado en la base de datos
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
            mail: 'portalvideojuegos@yahoo.com',
            contrasenia: '123456'
        });
        if (loginResponse.status === 200 && loginResponse.body?.token) {
            adminToken = loginResponse.body.token;
        }
        else {
            console.warn('⚠️  No se pudo obtener token de admin. Asegúrate de tener un usuario admin en la BD.');
        }
    });
    afterEach(async () => {
        const em = orm.em.fork();
        // Borra todas las categorías de prueba creadas por nombre. para que no quede basura en la bdd
        await em.nativeDelete(Categoria, {
            nombre: [
                testCategoryName,
                testCategoryName + ' Actualizada',
                testCategoryName + ' Flujo',
                'Modificada',
                '', // por si se creó una con nombre vacío
            ]
        });
    });
    afterAll(async () => {
        await orm.close();
    });
    beforeEach(async () => {
        // Limpiar categorías de prueba antes de cada test
        const em = orm.em.fork();
        const categoriasTest = await em.find(Categoria, { nombre: testCategoryName });
        if (categoriasTest.length > 0) {
            await em.removeAndFlush(categoriasTest);
        }
    });
    describe('POST /api/categoria - Crear categoría', () => {
        it('debería crear una nueva categoría con token válido', async () => {
            if (!adminToken) {
                console.log('⏭️  Saltando test: no hay token de admin');
                return;
            }
            const newCategory = {
                nombre: testCategoryName,
                detalle: 'Descripción de prueba para test de integración'
            };
            const response = await request(app)
                .post('/api/categoria')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newCategory)
                .expect(201);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject({
                nombre: newCategory.nombre,
                detalle: newCategory.detalle
            });
            expect(response.body.data).toHaveProperty('id');
            expect(typeof response.body.data.id).toBe('number');
        });
        it('debería fallar sin token de autorización', async () => {
            const response = await request(app)
                .post('/api/categoria')
                .send({ nombre: 'Test', detalle: 'Test' })
                .expect(401);
            expect(response.body).toHaveProperty('message');
        });
        it('permite crear categoría aunque el nombre sea vacío (comportamiento actual)', async () => {
            if (!adminToken) {
                console.log('⏭️  Saltando test: no hay token de admin');
                return;
            }
            const response = await request(app)
                .post('/api/categoria')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ nombre: '', detalle: 'Detalle' })
                .expect(201);
            expect(response.body.data).toMatchObject({ nombre: '', detalle: 'Detalle' });
        });
    });
    describe('GET /api/categoria - Listar categorías', () => {
        it('debería obtener todas las categorías sin autenticación', async () => {
            const response = await request(app)
                .get('/api/categoria')
                .expect(200);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
        it('debería incluir las propiedades correctas en cada categoría', async () => {
            const response = await request(app)
                .get('/api/categoria')
                .expect(200);
            if (response.body.data.length > 0) {
                const categoria = response.body.data[0];
                expect(categoria).toHaveProperty('id');
                expect(categoria).toHaveProperty('nombre');
                expect(categoria).toHaveProperty('detalle');
            }
        });
    });
    describe('PUT /api/categoria/:id - Actualizar categoría', () => {
        it('debería actualizar una categoría existente', async () => {
            if (!adminToken) {
                console.log('⏭️  Saltando test: no hay token de admin');
                return;
            }
            // Crear categoría primero
            const createResponse = await request(app)
                .post('/api/categoria')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ nombre: testCategoryName, detalle: 'Detalle original' });
            const categoryId = createResponse.body.data.id;
            // Actualizar
            const updatedData = {
                nombre: testCategoryName + ' Actualizada',
                detalle: 'Detalle actualizado'
            };
            const response = await request(app)
                .put(`/api/categoria/${categoryId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updatedData)
                .expect(200);
            expect(response.body.data).toMatchObject(updatedData);
            expect(response.body.data.id).toBe(categoryId);
        });
        it('debería fallar al actualizar sin autenticación', async () => {
            await request(app)
                .put('/api/categoria/1')
                .send({ nombre: 'Test', detalle: 'Test' })
                .expect(401);
        });
        it('debería fallar al actualizar categoría inexistente', async () => {
            if (!adminToken) {
                console.log('⏭️  Saltando test: no hay token de admin');
                return;
            }
            const response = await request(app)
                .put('/api/categoria/999999')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ nombre: 'Test', detalle: 'Test' })
                .expect(500);
            expect(response.body).toHaveProperty('message');
        });
    });
    describe('DELETE /api/categoria/:id - Eliminar categoría', () => {
        it('debería eliminar una categoría existente', async () => {
            if (!adminToken) {
                console.log('⏭️  Saltando test: no hay token de admin');
                return;
            }
            // Crear categoría primero
            const createResponse = await request(app)
                .post('/api/categoria')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ nombre: testCategoryName, detalle: 'Para eliminar' });
            const categoryId = createResponse.body.data.id;
            // Eliminar
            await request(app)
                .delete(`/api/categoria/${categoryId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            // Verificar que ya no existe
            const em = orm.em.fork();
            const deleted = await em.findOne(Categoria, { id: categoryId });
            expect(deleted).toBeNull();
        });
        it('debería fallar al eliminar sin autenticación', async () => {
            await request(app)
                .delete('/api/categoria/1')
                .expect(401);
        });
        it('devuelve 200 incluso si la categoría no existe (comportamiento actual)', async () => {
            if (!adminToken) {
                console.log('⏭️  Saltando test: no hay token de admin');
                return;
            }
            const response = await request(app)
                .delete('/api/categoria/999999')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(response.body).toHaveProperty('message');
        });
    });
    describe('Flujo completo CRUD', () => {
        it('debería completar el ciclo: crear → leer → actualizar → eliminar', async () => {
            if (!adminToken) {
                console.log('⏭️  Saltando test: no hay token de admin');
                return;
            }
            // 1. CREAR
            const createResponse = await request(app)
                .post('/api/categoria')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ nombre: testCategoryName + ' Flujo', detalle: 'Test flujo completo' })
                .expect(201);
            const categoryId = createResponse.body.data.id;
            expect(categoryId).toBeDefined();
            // 2. LEER - Verificar que aparezca en el listado
            const getResponse = await request(app)
                .get('/api/categoria')
                .expect(200);
            const found = getResponse.body.data.find((cat) => cat.id === categoryId);
            expect(found).toBeDefined();
            expect(found.nombre).toBe(testCategoryName + ' Flujo');
            // 3. ACTUALIZAR
            const updateResponse = await request(app)
                .put(`/api/categoria/${categoryId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ nombre: 'Modificada', detalle: 'Modificado' })
                .expect(200);
            expect(updateResponse.body.data.nombre).toBe('Modificada');
            // 4. ELIMINAR
            await request(app)
                .delete(`/api/categoria/${categoryId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            // 5. VERIFICAR ELIMINACIÓN
            const getDeleteResponse = await request(app)
                .get('/api/categoria')
                .expect(200);
            const deleteFound = getDeleteResponse.body.data.find((cat) => cat.id === categoryId);
            expect(deleteFound).toBeUndefined();
        });
    });
});
//# sourceMappingURL=categoria.integration.test.js.map