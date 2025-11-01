import 'dotenv/config';
import express from 'express';
import { companiaRouter } from './src/Compania/compania.routes.js';
import { categoriaRouter } from './src/Categoria/categoria.routes.js';
import { servicioRouter } from './src/Producto/Servicio/servicio.routes.js';
import { usuarioRouter } from './src/Usuario/usuario.routes.js';
import { authRouter } from './src/Auth/auth.routes.js';
import { juegoRouter } from './src/Producto/Juego/juego.routes.js';
import { complementoRouter } from './src/Producto/Complemento/complemento.routes.js';
import { ventaRouter } from './src/Venta/venta.routes.js';
import { reseniaRouter } from './src/Resenia/resenia.routes.js';
import { searchRouter } from './src/Search/search.routes.js';
import { checkoutRouter } from './src/Checkout/checkout.routes.js';
import { mailRouter } from './src/Mail/mail.routes.js';
import 'reflect-metadata';
import { orm, syncSchema } from './src/shared/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { swaggerUi, swaggerSpec } from './swagger.js';
const app = express();
// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); //a veces express bloquea peticiones de otras ip por seguridad, acá decimos que acepte todos los origenes
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); //además que acepte todos los métodos
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); //y estos headers
    // Manejar preflight requests. El navegador envía una petición OPTIONS antes de la petición real al backend.
    //Acá le decimos OK, podes mandar peticiones al back. No bloquees esto por seguridad
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
// Documentación Swagger. Solo Swagger en desarrollo por seguridad
if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.use('/api/juego', juegoRouter);
app.use('/api/complemento', complementoRouter);
app.use('/api/venta', ventaRouter);
app.use('/api/resenia', reseniaRouter);
app.use('/api/search', searchRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/mail', mailRouter);
app.use((_, res) => {
    res.status(404).send({ message: 'Resource not found' });
    return;
});
await syncSchema(); //nunca en producción. cambia los datos del schema según nuestro código automáticamente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
});
//# sourceMappingURL=app.js.map