import 'dotenv/config';
import express from 'express';
import { companiaRouter } from './src/Compania/compania.routes.js';
import { categoriaRouter } from './src/Categoria/categoria.routes.js';
import { servicioRouter } from './src/Producto/Servicio/servicio.routes.js';
import { usuarioRouter } from './src/Usuario/usuario.routes.js';
import { authRouter } from './src/Auth/auth.routes.js';
import 'reflect-metadata';
import { orm, syncSchema } from './src/shared/orm.js';
import { RequestContext } from '@mikro-orm/core';
const app = express();
// Configurar CORS manualmente
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
app.use(express.json());
//luego de los middlewares base
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
//antes de las rutas y middlewares de negocio
app.use('/api/auth', authRouter);
app.use('/api/compania', companiaRouter);
app.use('/api/categoria', categoriaRouter);
app.use('/api/servicio', servicioRouter);
app.use('/api/usuario', usuarioRouter);
app.use((_, res) => {
    res.status(404).send({ message: 'Resource not found' });
    return;
});
await syncSchema(); //nunca en producción
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}/`);
});
//# sourceMappingURL=app.js.map