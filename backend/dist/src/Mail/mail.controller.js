import nodemailer from 'nodemailer';
async function sendMail(req, res) {
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
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Error enviando mail' });
    }
}
export { sendMail };
//# sourceMappingURL=mail.controller.js.map