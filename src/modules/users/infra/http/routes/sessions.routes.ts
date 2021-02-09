// ROUTES, recieve requisitions, call other file, return a response
// import { request, response, Router } from 'express';
import { Router } from 'express';
//import AppError from '@shared/errors/AppErrors';

import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();

const sessionController = new SessionsController();

sessionsRouter.post('/',sessionController.create);

export default sessionsRouter;

