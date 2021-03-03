// ROUTES, recieve requisitions, call other file, return a response

import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/',celebrate(
  {
    [Segments.BODY]:{
      provider_id:Joi.string().uuid().required(),
      date: Joi.date(),
    }
  }), appointmentsController.create);

appointmentsRouter.get('/me', providerAppointmentsController.index);

// appointmentsRouter.get('/', async (request, response) => {

//     //console.log(request.user);


//     const appointments = await appointmentsRepository.();
//     // return response.json({caraleo:'caraleo'});
// });

// appointmentsRouter.get('/',celebrate(
//   {
//     [Segments.BODY]:{
//       provider_id:Joi.string().uuid().required(),
//       date: Joi.date(),
//     }
//   }
// ), appointmentsController.index);


export default appointmentsRouter;

