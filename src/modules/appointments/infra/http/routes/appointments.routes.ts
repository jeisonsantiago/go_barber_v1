// ROUTES, recieve requisitions, call other file, return a response

import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {

//     //console.log(request.user);


//     const appointments = await appointmentsRepository.();
//     // return response.json({caraleo:'caraleo'});
// });

appointmentsRouter.get('/',appointmentsController.index);
appointmentsRouter.post('/', appointmentsController.create);

appointmentsRouter.get('/me',providerAppointmentsController.index);

export default appointmentsRouter;

