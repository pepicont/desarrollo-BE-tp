import { orm } from '../shared/orm.js';
import { Juego } from '../Producto/Juego/juego.entity.js';
import { Servicio } from '../Producto/Servicio/servicio.entity.js';
import { Complemento } from '../Producto/Complemento/complemento.entity.js';
import { Venta } from '../Venta/venta.entity.js';
import 'dotenv/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
const em = orm.em;
const sessions = new Map();
const processedPayments = new Set();
const paymentVentaMap = new Map();
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
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
const WEBHOOK_BASE_URL = (process.env.WEBHOOK_BASE_URL || '').trim() || undefined;
const FORCE_AUTO_RETURN = String(process.env.MP_AUTO_RETURN || '').toLowerCase() === 'true';
const MP_CURRENCY = process.env.MP_CURRENCY;
const MP_TOKEN_ENV_KEYS = [
    'MP_ACCESS_TOKEN',
    'MERCADOPAGO_ACCESS_TOKEN',
    'ACCESS_TOKEN',
    'MERCADOPAGO_TOKEN',
];
function getMpToken() {
    for (const key of MP_TOKEN_ENV_KEYS) {
        const val = process.env[key];
        if (typeof val === 'string') {
            const trimmed = val.trim();
            if (trimmed.length > 0)
                return trimmed;
        }
    }
    return undefined;
}
function getMpClient() {
    const token = getMpToken();
    return token ? new MercadoPagoConfig({ accessToken: token }) : null;
}
function isLocalhostUrl(url) {
    try {
        const u = new URL(url);
        return /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(u.hostname);
    }
    catch {
        return false;
    }
}
function clientRedirect(res, targetUrl) {
    if (isLocalhostUrl(targetUrl)) {
        const safeUrl = targetUrl.replace(/</g, '%3C');
        const html = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url='${safeUrl}'" /></head><body><script>window.location.replace(${JSON.stringify(safeUrl)});</script><p>Redirigiendo a <a href="${safeUrl}">${safeUrl}</a>...</p></body></html>`;
        res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(html);
        return;
    }
    res.redirect(302, targetUrl);
}
export async function startMpPreference(req, res) {
    try {
        const mpClient = getMpClient();
        if (!mpClient)
            return res.status(500).json({ message: 'Mercado Pago no configurado', varsDetected: MP_TOKEN_ENV_KEYS.filter(k => !!process.env[k]) });
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Usuario no autenticado' });
        const { tipo, id } = req.body;
        if (!['juego', 'servicio', 'complemento'].includes(tipo) || !id) {
            return res.status(400).json({ message: 'Parámetros inválidos' });
        }
        // Obtener datos del producto
        let title = '', unit_price = 0;
        try {
            if (tipo === 'juego') {
                const p = await em.findOneOrFail(Juego, { id });
                title = p.nombre;
                unit_price = Number(p.monto);
            }
            if (tipo === 'servicio') {
                const p = await em.findOneOrFail(Servicio, { id });
                title = p.nombre;
                unit_price = Number(p.monto);
            }
            if (tipo === 'complemento') {
                const p = await em.findOneOrFail(Complemento, { id });
                title = p.nombre;
                unit_price = Number(p.monto);
            }
        }
        catch (nf) {
            if (nf?.name === 'NotFoundError') {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            throw nf;
        }
        if (!Number.isFinite(unit_price) || unit_price <= 0) {
            return res.status(400).json({ message: 'El producto no se puede pagar por Mercado Pago (precio debe ser mayor a 0).' });
        }
        const external_reference = makeCode('ORD');
        const preference = new Preference(mpClient);
        const notificationUrl = WEBHOOK_BASE_URL || (!/localhost|127\.0\.0\.1/i.test(BACKEND_BASE_URL) ? `${BACKEND_BASE_URL.replace(/\/$/, '')}/api/checkout/mp/webhook` : undefined);
        // Si BACKEND_BASE_URL quedó en localhost por error, pero el WEBHOOK_BASE_URL apunta al túnel,
        // usamos el origen del webhook para construir la URL de success.
        let webhookOrigin;
        try {
            if (WEBHOOK_BASE_URL)
                webhookOrigin = new URL(WEBHOOK_BASE_URL).origin;
        }
        catch { }
        const baseForSuccess = (/localhost|127\.0\.0\.1/i.test(BACKEND_BASE_URL || '') && webhookOrigin)
            ? webhookOrigin
            : (BACKEND_BASE_URL || '');
        const backendSuccess = `${baseForSuccess.replace(/\/$/, '')}/api/checkout/mp/success`;
        const isFrontendLocalhost = /localhost|127\.0\.0\.1/i.test(FRONTEND_BASE_URL || '');
        const back_urls = {
            success: (isFrontendLocalhost ? backendSuccess : `${FRONTEND_BASE_URL.replace(/\/$/, '')}/checkout/success?provider=mp`),
            failure: `${FRONTEND_BASE_URL.replace(/\/$/, '')}/checkout?failed=1`,
            pending: `${FRONTEND_BASE_URL.replace(/\/$/, '')}/checkout?pending=1`,
        };
        // Activar auto_return si la URL de success es https y no localhost (ej: backend callback por túnel),
        // se recomienda usar auto_return en producción.
        const successIsHttps = back_urls.success.startsWith('https://') && !/localhost|127\.0\.0\.1/i.test(back_urls.success);
        const useAutoReturn = FORCE_AUTO_RETURN || successIsHttps;
        if (!successIsHttps && FORCE_AUTO_RETURN) {
            console.warn('MP auto_return forced but success URL is not https; Mercado Pago podría rechazarlo');
        }
        console.log('MP start pref:', { userId, tipo, id, title, unit_price, FRONTEND_BASE_URL, BACKEND_BASE_URL, WEBHOOK_BASE_URL, notificationUrl, useAutoReturn, back_urls });
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: String(id),
                        title,
                        quantity: 1,
                        unit_price: Number(unit_price),
                        ...(MP_CURRENCY ? { currency_id: MP_CURRENCY } : {}),
                    },
                ],
                back_urls,
                ...(useAutoReturn ? { auto_return: 'approved' } : {}),
                ...(notificationUrl ? { notification_url: notificationUrl } : {}),
                metadata: { userId, tipo, productId: id },
                external_reference,
            }
        });
        return res.status(200).json({ message: 'mp preference created', data: { id: result.id, init_point: result.init_point || result.sandbox_init_point } });
    }
    catch (error) {
        console.error('MP preference error:', error?.message || error);
        if (error?.cause)
            console.error('MP error cause:', error.cause);
        const status = typeof error?.status === 'number' ? error.status : 500;
        return res.status(status).json({
            message: error?.message || 'Error creando preferencia de pago',
            ...(error?.cause ? { cause: error.cause } : {}),
        });
    }
}
export async function mpWebhook(req, res) {
    try {
        // Mercado Pago envía varios tipos/formatos de notificaciones. Nos interesan pagos.
        const typeOrTopic = (req.query.type || req.body?.type || req.query.topic || req.body?.topic);
        const action = (req.query.action || req.body?.action);
        // data.id puede venir en query o body (webhooks v1 y v2). También pueden enviar id directo o resource URL.
        let paymentId = (req.query['data.id'] || req.body?.data?.id || req.query.id || req.body?.id);
        const resource = (req.query.resource || req.body?.resource);
        // Extraer paymentId desde resource si es necesario
        if (!paymentId && typeof resource === 'string') {
            const m = resource.match(/\/payments\/(\d+)/);
            if (m && m[1])
                paymentId = m[1];
        }
        const isPayment = typeOrTopic === 'payment' || (typeof action === 'string' && action.startsWith('payment.'));
        if (!isPayment || !paymentId) {
            console.log('MP webhook ignored:', { typeOrTopic, paymentId, query: req.query, body: req.body });
            return res.status(200).send('ok');
        }
        const mpClient = getMpClient();
        if (!mpClient)
            return res.status(500).send('MP not configured');
        // Evitar concurrencia duplicada
        const inFlight = global.__mpInFlight || new Set();
        global.__mpInFlight = inFlight;
        if (inFlight.has(paymentId))
            return res.status(200).send('ok');
        if (processedPayments.has(paymentId) || paymentVentaMap.has(paymentId))
            return res.status(200).send('ok');
        inFlight.add(paymentId);
        const payment = new Payment(mpClient);
        const info = await payment.get({ id: paymentId });
        console.log('MP payment info:', { id: paymentId, status: info.status, metadata: info.metadata });
        if (processedPayments.has(paymentId) || paymentVentaMap.has(paymentId)) {
            inFlight.delete(paymentId);
            return res.status(200).send('ok');
        }
        if (info.status === 'approved') {
            // Recuperar metadata para crear la venta
            const md = info.metadata || {};
            const userId = md.userId ?? md.user_id;
            const tipo = md.tipo;
            const productId = md.productId ?? md.product_id;
            if (userId && tipo && productId) {
                const venta = new Venta();
                venta.usuario = userId;
                venta.fecha = new Date();
                venta.codActivacion = makeCode('ACT');
                if (tipo === 'juego')
                    venta.juego = productId;
                if (tipo === 'servicio')
                    venta.servicio = productId;
                if (tipo === 'complemento')
                    venta.complemento = productId;
                await em.persistAndFlush(venta);
                processedPayments.add(paymentId);
                if (venta.id)
                    paymentVentaMap.set(paymentId, venta.id);
                console.log('Venta creada desde webhook:', { paymentId, userId, tipo, productId, ventaId: venta.id });
            }
            else {
                console.warn('MP webhook approved but metadata incomplete:', { metadata: md });
            }
        }
        inFlight.delete(paymentId);
        return res.status(200).send('ok');
    }
    catch (err) {
        console.error('MP webhook error:', err);
        return res.status(200).send('ok');
    }
}
// Callback público para usar en back_urls.success cuando no tenemos auto_return (frontend http/localhost)
export async function mpSuccessCallback(req, res) {
    try {
        const mpClient = getMpClient();
        if (!mpClient)
            return res.status(500).send('MP not configured');
        const paymentId = String(req.query.payment_id || req.query.collection_id || '');
        if (!paymentId)
            return clientRedirect(res, `${FRONTEND_BASE_URL.replace(/\/$/, '')}/checkout?failed=1`);
        if (processedPayments.has(paymentId) || paymentVentaMap.has(paymentId)) {
            const ventaId = paymentVentaMap.get(paymentId);
            return clientRedirect(res, `${FRONTEND_BASE_URL.replace(/\/$/, '')}/checkout/success?provider=mp&payment_id=${encodeURIComponent(paymentId)}${ventaId ? `&venta_id=${ventaId}` : ''}`);
        }
        const payment = new Payment(mpClient);
        const info = await payment.get({ id: paymentId });
        if (info.status !== 'approved') {
            return clientRedirect(res, `${FRONTEND_BASE_URL.replace(/\/$/, '')}/checkout?failed=1`);
        }
        const md = info.metadata || {};
        const userId = md.userId ?? md.user_id;
        const tipo = md.tipo;
        const productId = md.productId ?? md.product_id;
        if (userId && tipo && productId && !processedPayments.has(paymentId) && !paymentVentaMap.has(paymentId)) {
            const venta = new Venta();
            venta.usuario = userId;
            venta.fecha = new Date();
            venta.codActivacion = makeCode('ACT');
            if (tipo === 'juego')
                venta.juego = productId;
            if (tipo === 'servicio')
                venta.servicio = productId;
            if (tipo === 'complemento')
                venta.complemento = productId;
            await em.persistAndFlush(venta);
            processedPayments.add(paymentId);
            if (venta.id)
                paymentVentaMap.set(paymentId, venta.id);
            console.log('Venta creada desde success callback:', { paymentId, userId, tipo, productId, ventaId: venta.id });
        }
        {
            const ventaId = paymentVentaMap.get(paymentId);
            return clientRedirect(res, `${FRONTEND_BASE_URL.replace(/\/$/, '')}/checkout/success?provider=mp&payment_id=${encodeURIComponent(paymentId)}${ventaId ? `&venta_id=${ventaId}` : ''}`);
        }
    }
    catch (error) {
        console.error('MP success callback error:', error);
        return clientRedirect(res, `${FRONTEND_BASE_URL.replace(/\/$/, '')}/checkout?failed=1`);
    }
}
export async function confirmMpPayment(req, res) {
    try {
        const mpClient = getMpClient();
        if (!mpClient)
            return res.status(500).json({ message: 'Mercado Pago no configurado' });
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Usuario no autenticado' });
        const paymentId = String(req.query.payment_id || req.query.collection_id || '');
        if (!paymentId)
            return res.status(400).json({ message: 'payment_id o collection_id requerido' });
        const payment = new Payment(mpClient);
        const info = await payment.get({ id: paymentId });
        if (info.status !== 'approved') {
            return res.status(400).json({ message: 'Pago no aprobado aún' });
        }
        const md = info.metadata || {};
        const tipo = md.tipo;
        const productId = md.productId;
        if (processedPayments.has(paymentId)) {
            return res.status(200).json({ message: 'already confirmed', data: { status: 'paid' } });
        }
        // Crear la venta si todo está ok
        const venta = new Venta();
        venta.usuario = userId;
        venta.fecha = new Date();
        venta.codActivacion = makeCode('ACT');
        if (tipo === 'juego')
            venta.juego = productId;
        if (tipo === 'servicio')
            venta.servicio = productId;
        if (tipo === 'complemento')
            venta.complemento = productId;
        await em.persistAndFlush(venta);
        processedPayments.add(paymentId);
        if (venta.id)
            paymentVentaMap.set(paymentId, venta.id);
        // redireccionamos a frontend success page 
        const wantRedirect = String(req.query.redirect || '').toLowerCase();
        if (wantRedirect === '1' || wantRedirect === 'true') {
            const successUrl = `${FRONTEND_BASE_URL.replace(/\/$/, '')}/checkout/success?provider=mp&payment_id=${encodeURIComponent(paymentId)}${venta.id ? `&venta_id=${venta.id}` : ''}`;
            return clientRedirect(res, successUrl);
        }
        return res.status(200).json({ message: 'pago confirmado', data: { status: 'paid', venta } });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
// Endpoint para que el frontend recupere la venta a partir del payment_id (en memoria)
export async function mpResult(req, res) {
    try {
        const paymentId = String(req.query.payment_id || req.query.collection_id || '');
        if (!paymentId)
            return res.status(400).json({ message: 'payment_id requerido' });
        const ventaId = paymentVentaMap.get(paymentId);
        if (!ventaId)
            return res.status(404).json({ message: 'resultado no encontrado (aún)', data: { status: 'pending' } });
        const venta = await em.findOne(Venta, { id: ventaId }, { populate: ['juego', 'servicio', 'complemento'] });
        if (!venta)
            return res.status(404).json({ message: 'venta no encontrada' });
        return res.status(200).json({ message: 'resultado de pago', data: { status: 'paid', venta } });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
//# sourceMappingURL=checkout.controller.js.map