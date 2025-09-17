import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { orm } from '../shared/orm.js';
import { Usuario } from '../Usuario/usuario.entity.js';
import * as bcrypt from 'bcrypt';

export async function sendMail(req: Request, res: Response) {
  const { mail, asunto, detalle } = req.body;
  if (!mail || !asunto || !detalle) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.MAILTO,
      subject: 'mail prueba',
      text: `Remitente: ${mail}\nAsunto original: ${asunto}\n\n${detalle}`,
      headers: {
          'Importance': 'high',
          'X-Priority': '1'
        }
    });

    res.status(200).json({ message: 'Mail enviado correctamente' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error enviando mail' });
  }
}

function generarPasswordAleatoria(length = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Falta el email' });
  try {
    const em = orm.em.fork();
    const usuario = await em.findOne(Usuario, { mail: email });
    if (!usuario) {
      return res.status(404).json({ message: 'No se encontró un mail asociado a esa cuenta' });
    }
    const nuevaPass = generarPasswordAleatoria();
    const hash = await bcrypt.hash(nuevaPass, 10);
    usuario.contrasenia = hash;
    await em.persistAndFlush(usuario);

    // Enviar mail con la nueva contraseña
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Contraseña de recuperación de cuenta - Portalvideojuegos',
      html: `<h2>Hola ${usuario.nombre}</h2><p>Tu nueva contraseña es: <b>${nuevaPass}</b>. Te recomendamos cambiarla luego de ingresar.<br><br>Si no fuiste vos quien solicitó esta recuperación de contraseña, por favor comunicate con uno de nuestros administradores.</p>`,
      headers: {
        'Importance': 'high',
        'X-Priority': '1'
      }
    });
    return res.status(200).json({ message: 'Mail enviado con la nueva contraseña' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error en la recuperación', error: error.message });
  }
}

export async function welcome(req: Request, res: Response) {
  const { email, nombre } = req.body;
  if (!email || !nombre) return res.status(400).json({ message: 'Faltan datos requeridos' });
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: '¡Bienvenido a Portalvideojuegos!',
      html: `<h2>¡Hola ${nombre}!</h2><p>Te damos la bienvenida a Portalvideojuegos. Ya puedes disfrutar de todos nuestros servicios y beneficios.</p><p>¡Gracias por registrarte!</p>`,
      headers: {
        'Importance': 'high',
        'X-Priority': '1'
      }
    });
    return res.status(200).json({ message: 'Mail de bienvenida enviado' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error enviando mail de bienvenida', error: error.message });
  }
}

export async function notifyCredentialsChange(req: Request, res: Response) {
  const { email, oldUsername } = req.body;
  if (!email || !oldUsername) return res.status(400).json({ message: 'Faltan datos requeridos' });
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Cambio de credenciales de acceso - Portal videojuegos',
      html: `<h2>Hola ${oldUsername}.</h2><p>Se han cambiado tus credenciales de acceso. Si no fuiste vos, por favor contactate con uno de nuestros administradores.</p>`,
      headers: {
        'Importance': 'high',
        'X-Priority': '1'
      }
    });
    return res.status(200).json({ message: 'Mail de notificación de cambio de credenciales enviado' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error enviando mail de notificación', error: error.message });
  }
}

export async function paymentConfirmation(req: Request, res: Response) {
  const { email, nombre, producto, codigo } = req.body;
  if (!email || !nombre || !producto || !codigo) return res.status(400).json({ message: 'Faltan datos requeridos' });
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Confirmación de compra - Portalvideojuegos',
      html: `<h2>¡Hola ${nombre}!</h2><p>Tu compra fue confirmada.</p><p><b>Producto:</b> ${producto}<br/><b>Código de activación:</b> ${codigo}</p><p>¡Gracias por tu compra!</p>`,
      headers: {
        'Importance': 'high',
        'X-Priority': '1'
      }
    });
    return res.status(200).json({ message: 'Mail de confirmación de compra enviado' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error enviando mail de confirmación de compra', error: error.message });
  }
}