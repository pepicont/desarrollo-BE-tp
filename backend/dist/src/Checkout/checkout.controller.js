import { orm } from '../shared/orm.js';
import { Juego } from '../Producto/Juego/juego.entity.js';
import { Servicio } from '../Producto/Servicio/servicio.entity.js';
import { Complemento } from '../Producto/Complemento/complemento.entity.js';
import { Venta } from '../Venta/venta.entity.js';
const em = orm.em;
// Simulación simple en memoria (NOTA: reemplazar por integración con Mercado Pago/Stripe)
const sessions = new Map();
function makeCode(prefix) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < 16; i++)
        out += chars[Math.floor(Math.random() * chars.length)];
    return `${prefix}-${out}`;
}
function makeSessionId() {
    return 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
export async function startSession(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Usuario no autenticado' });
        const { tipo, id } = req.body;
        if (!['juego', 'servicio', 'complemento'].includes(tipo) || !id) {
            return res.status(400).json({ message: 'Parámetros inválidos' });
        }
        // Validar que el producto exista
        if (tipo === 'juego')
            await em.findOneOrFail(Juego, { id });
        if (tipo === 'servicio')
            await em.findOneOrFail(Servicio, { id });
        if (tipo === 'complemento')
            await em.findOneOrFail(Complemento, { id });
        const sessionId = makeSessionId();
        const session = { id: sessionId, userId, tipo, productId: id, status: 'pending' };
        sessions.set(sessionId, session);
        // NOTA: Aquí normalmente se crearía una preferencia de pago en Mercado Pago o una Checkout Session en Stripe
        return res.status(200).json({ message: 'checkout session created (simulada)', data: { sessionId, status: 'pending' } });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function simulateSuccess(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Usuario no autenticado' });
        const { sessionId } = req.body;
        const session = sessionId ? sessions.get(sessionId) : undefined;
        if (!session || session.userId !== userId)
            return res.status(404).json({ message: 'Sesión no encontrada' });
        if (session.status !== 'pending')
            return res.status(400).json({ message: 'Sesión no válida para confirmar' });
        // Crear la venta como si el pago hubiera sido aprobado por el proveedor
        const venta = new Venta();
        venta.usuario = userId;
        venta.fecha = new Date();
        venta.codActivacion = makeCode('ACT');
        if (session.tipo === 'juego')
            venta.juego = session.productId;
        if (session.tipo === 'servicio')
            venta.servicio = session.productId;
        if (session.tipo === 'complemento')
            venta.complemento = session.productId;
        await em.persistAndFlush(venta);
        session.status = 'paid';
        session.ventaId = venta.id;
        sessions.set(sessionId, session);
        return res.status(200).json({
            message: 'pago simulado y venta creada',
            data: { status: session.status, venta }
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function getStatus(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Usuario no autenticado' });
        const sessionId = String(req.query.sessionId || '');
        const session = sessionId ? sessions.get(sessionId) : undefined;
        if (!session || session.userId !== userId)
            return res.status(404).json({ message: 'Sesión no encontrada' });
        return res.status(200).json({ message: 'checkout status', data: { status: session.status, ventaId: session.ventaId } });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
//# sourceMappingURL=checkout.controller.js.map