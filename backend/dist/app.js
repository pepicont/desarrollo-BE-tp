import express from 'express';
import { companiaRouter } from './src/Compania/compania.routes.js';
import 'reflect-metadata';
import { orm } from './src/shared/orm.js';
import { RequestContext } from '@mikro-orm/core';
const app = express();
app.use(express.json());
//luego de los middlewares base
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
//antes de las rutas y middlewares de negocio
app.use('/api/compania', companiaRouter);
app.use((_, res) => {
    res.status(404).send({ message: 'Resource not found' });
    return;
});
app.listen(3000, () => {
    console.log('Server runnning on http://localhost:3000/');
});
//# sourceMappingURL=app.js.map