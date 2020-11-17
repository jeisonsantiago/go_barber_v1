import Appointment from '../models/Appointment';
import { startOfHour } from 'date-fns';
import {getCustomRepository} from 'typeorm';
import AppointmentsRepository from '../repositories/Apointments.repository';

// services awayls have only one method, and are
// responsible for only one thing (unica responsabilidade)
// services don't have access to request, response
// services holds the (business rules) from the application

interface Request{
    provider:string;
    date:Date;
}

/**
 * DEPENDENCY INVERSION (SOLID)
 */

class CreateAppointmentService {

    public async execute({provider,date}:Request):Promise<Appointment> {

        const appointmentsRepository = getCustomRepository(AppointmentsRepository);

        const appointmentDate = startOfHour(date); // regra de negocio

        const isBooked = await appointmentsRepository.findByDate(appointmentDate);

        if (isBooked) {
            throw Error('Appointment already booked.');
        }

        const appointment = appointmentsRepository.create({
            provider:provider,
            date: appointmentDate
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;