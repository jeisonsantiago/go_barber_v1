import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppErrors';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

// services awayls have only one method, and are
// responsible for only one thing (unica responsabilidade)
// services don't have access to request, response
// services holds the (business rules) from the application

interface IRequest {
  id: string;
  provider_id: string;
  date: Date;
}

/**
 * DEPENDENCY INVERSION (SOLID)
 */

class CreateAppointmentService {

  constructor(
    // private inside parameter creates a this.appointmentsRepository variable
    // inside CreateAppointmentService class, neat shit.
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({ id, provider_id, date }: IRequest): Promise<Appointment> {

    const appointmentDate = startOfHour(date); // regra de negocio

    const isBooked = await this.appointmentsRepository.findByDate(appointmentDate);

    if (isBooked) {
      throw new AppError('Appointment already booked.');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id: provider_id,
      date: appointmentDate
    });

    return appointment;
  }
}

export default CreateAppointmentService;
