import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { Categoria } from '../Categoria/categoria.entity.js';
import { Compania } from '../Compania/compania.entity.js';
export const orm = await MikroORM.init({
    //entities: ['dist/**/*.entity.js'],
    //entitiesTs: ['src/**/*.entity.ts'],
    entities: [
        Categoria, Compania
    ],
    entitiesTs: [
        Categoria, Compania
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