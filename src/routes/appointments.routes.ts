// ROUTES, recieve requisitions, call other file, return a response

import { Router } from 'express';
import { parseISO } from 'date-fns';
import {getCustomRepository} from 'typeorm';
import AppointmentsRepository from '../repositories/Apointments.repository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepository.find();
    return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {

    try {
        const { id,provider_id, date } = request.body;

        // parseISO = parse date to 'Date' (javascript) format.
        const parsedDate = parseISO(date); // transform data

        const createAppointment = new CreateAppointmentService();

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

