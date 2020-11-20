import Appointment from '../models/Appointment';
import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentsRepository from '../repositories/Apointments.repository';
import AppError from '../errors/AppErrors';

// services awayls have only one method, and are
// responsible for only one thing (unica responsabilidade)
// services don't have access to request, response
// services holds the (business rules) from the application

interface Request {
    id: string;
    provider_id: string;
    date: Date;
}

/**
 * DEPENDENCY INVERSION (SOLID)
 */

class CreateAppointmentService {

    public async execute({ id, provider_id, date }: Request): Promise<Appointment> {

        const appointmentsRepository = getCustomRepository(AppointmentsRepository);

        const appointmentDate = startOfHour(date); // regra de negocio

        const isBooked = await appointmentsRepository.findByDate(appointmentDate);

        if (isBooked) {
            throw new AppError('Appointment already booked.');
        }

        const appointment = appointmentsRepository.create({
            id:id,
            provider_id: provider_id,
            date: appointmentDate
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;