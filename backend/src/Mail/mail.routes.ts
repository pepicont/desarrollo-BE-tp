import { Router } from 'express';
import { sendMail, forgotPassword, welcome, notifyCredentialsChange, paymentConfirmation, deletedUser } from './mail.controller.js';


const mailRouter = Router();
mailRouter.post('/', sendMail as any);
mailRouter.post('/forgot-password', forgotPassword as any);
mailRouter.post('/welcome', welcome as any);
mailRouter.post('/notify-credentials-change', notifyCredentialsChange as any);
mailRouter.post('/payment-confirmation', paymentConfirmation as any);
mailRouter.post('/deleted-user', deletedUser as any);
export { mailRouter };