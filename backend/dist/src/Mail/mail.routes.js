import { Router } from 'express';
import { sendMail, forgotPassword, welcome, notifyCredentialsChange, paymentConfirmation, deletedUser } from './mail.controller.js';
const mailRouter = Router();
mailRouter.post('/', sendMail);
mailRouter.post('/forgot-password', forgotPassword);
mailRouter.post('/welcome', welcome);
mailRouter.post('/notify-credentials-change', notifyCredentialsChange);
mailRouter.post('/payment-confirmation', paymentConfirmation);
mailRouter.post('/deleted-user', deletedUser);
export { mailRouter };
//# sourceMappingURL=mail.routes.js.map