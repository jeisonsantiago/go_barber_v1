import {Router} from 'express';

import appointmentsRouter from './appointments.routes';


const routes = Router();

// routes.use('/',appointmentsRouter);
routes.use('/appointments',appointmentsRouter);

export default routes;