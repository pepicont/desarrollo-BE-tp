import { Router } from 'express';
import { sendMail } from './mail.controller.js';

const mailRouter = Router();
mailRouter.post('/', sendMail as any);
export { mailRouter };