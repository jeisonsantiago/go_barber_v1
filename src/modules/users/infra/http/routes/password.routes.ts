// ROUTES, recieve requisitions, call other file, return a response
// import { request, response, Router } from 'express';
import { Router } from 'express';
//import AppError from '@shared/errors/AppErrors';

import ResetPasswordController from '../controllers/ResetPasswordController';
import ForgotPasswordController from '../controllers/ForgotPasswordController';

const passwordRouter = Router();

const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post('/forgot',forgotPasswordController.create);
passwordRouter.post('/reset',resetPasswordController.create);

export default passwordRouter;

