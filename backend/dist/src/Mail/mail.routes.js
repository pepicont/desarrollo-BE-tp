import { Router } from 'express';
import { sendMail, forgotPassword, welcome, notifyCredentialsChange, paymentConfirmation } from './mail.controller.js';
const mailRouter = Router();
mailRouter.post('/', sendMail);
mailRouter.post('/forgot-password', forgotPassword);
mailRouter.post('/welcome', welcome);
mailRouter.post('/notify-credentials-change', notifyCredentialsChange);
mailRouter.post('/payment-confirmation', paymentConfirmation);
export { mailRouter };
//# sourceMappingURL=mail.routes.js.map