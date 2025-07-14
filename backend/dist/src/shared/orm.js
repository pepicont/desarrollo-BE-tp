import { MikroORM } from '@mikro-orm/core';
export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'portalvideojuegos',
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