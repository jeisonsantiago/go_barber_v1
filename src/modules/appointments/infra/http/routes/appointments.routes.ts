// ROUTES, recieve requisitions, call other file, return a response

import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/Apointments.repository'
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {

//     console.log(request.user);

//     //const appointmentsRepository = getCustomRepository(AppointmentsRepository);
//     const appointments = await appointmentsRepository.find();
//     return response.json(appointments);
// });

appointmentsRouter.post('/', async (request, response) => {

    try {
        const { id,provider_id, date } = request.body;

        // parseISO = parse date to 'Date' (javascript) format.
        const parsedDate = parseISO(date); // transform data

        const createAppointment = new CreateAppointmentService(appointmentsRepository);

        const appointment = await createAppointment.execute({
            id:id,
            provider_id: provider_id,
            date: parsedDate,
        });

        return response.json({ appointment: appointment });

    } catch (error) {
        return response
        .status(400)
        .json({error:error.message});
    }
});

export default appointmentsRouter;

