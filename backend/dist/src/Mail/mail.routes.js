import { Router } from 'express';
import { sendMail } from './mail.controller.js';
const mailRouter = Router();
mailRouter.post('/', sendMail);
export { mailRouter };
//# sourceMappingURL=mail.routes.js.map