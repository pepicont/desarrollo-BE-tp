import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { Categoria } from '../Categoria/categoria.entity.js';
import { Compania } from '../Compania/compania.entity.js';
import { Servicio } from '../Producto/Servicio/servicio.entity.js';
import { Juego } from '../Producto/Juego/juego.entity.js';
import { Complemento } from '../Producto/Complemento/complemento.entity.js';
import { Usuario } from '../Usuario/usuario.entity.js';
import { Venta } from '../Venta/venta.entity.js';
export const orm = await MikroORM.init({
    //entities: ['dist/**/*.entity.js'],
    //entitiesTs: ['src/**/*.entity.ts'],
    entities: [
        Categoria, Compania, Servicio, Juego, Complemento, Usuario, Venta
    ],
    entitiesTs: [
        Categoria, Compania, Servicio, Juego, Complemento, Usuario, Venta
    ],
    dbName: 'portalvideojuegos',
    driver: MySqlDriver,
    clientUrl: 'mysql://dsw:dsw@localhost:3307/portalvideojuegos',
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