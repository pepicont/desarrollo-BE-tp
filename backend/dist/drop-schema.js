import { MikroORM } from '@mikro-orm/core';
import ormConfig from './src/shared/orm';
async function dropSchema() {
    const orm = await MikroORM.init(ormConfig);
    const generator = orm.getSchemaGenerator();
    await generator.dropSchema();
    console.log('Schema dropped successfully.');
    await orm.close();
}
dropSchema().catch((err) => {
    console.error('Error dropping schema:', err);
    process.exit(1);
});
//# sourceMappingURL=drop-schema.js.map