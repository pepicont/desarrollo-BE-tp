import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { Categoria } from '../Categoria/categoria.entity.js';
import { Compania } from '../Compania/compania.entity.js';
import { Servicio } from '../Producto/Servicio/servicio.entity.js';
import { Juego } from '../Producto/Juego/juego.entity.js';
import { Complemento } from '../Producto/Complemento/complemento.entity.js';
import { Usuario } from '../Usuario/usuario.entity.js';
import { Venta } from '../Venta/venta.entity.js';
import { Resenia } from '../Resenia/resenia.entity.js';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3307);
const DB_USER = process.env.DB_USER || 'dsw';
const DB_PASSWORD = process.env.DB_PASSWORD || 'dsw';
const DB_NAME = process.env.DB_NAME || 'portalvideojuegos';
export const orm = await MikroORM.init({
    //entities: ['dist/**/*.entity.js'],
    //entitiesTs: ['src/**/*.entity.ts'],
    entities: [
        Categoria, Compania, Servicio, Juego, Complemento, Usuario, Venta, Resenia
    ],
    entitiesTs: [
        Categoria, Compania, Servicio, Juego, Complemento, Usuario, Venta, Resenia
    ],
    dbName: DB_NAME,
    driver: MySqlDriver,
    clientUrl: `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    debug: true,
    schemaGenerator: {
        //never in production
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
    },
});
export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    /*
    await generator.dropSchema() USAR ESTO CUANDO FALLE EL UPDATE SCHEMA
    await generator.createSchema()
    */
    await generator.updateSchema();
};
//# sourceMappingURL=orm.js.map