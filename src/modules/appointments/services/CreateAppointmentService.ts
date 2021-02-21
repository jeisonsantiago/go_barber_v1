import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { isEqual, startOfHour, isBefore } from 'date-fns';
import AppError from '@shared/errors/AppErrors';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import { injectable, inject } from 'tsyringe';
import { is } from 'date-fns/locale';
import appointmentsRouter from '../infra/http/routes/appointments.routes';
// services awayls have only one method, and are
// responsible for only one thing (unica responsabilidade)
// services don't have access to request, response
// services holds the (business rules) from the application

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

/**
 * DEPENDENCY INVERSION (SOLID)
 */
@injectable()
class CreateAppointmentService {

  constructor(
    // private inside parameter creates a this.appointmentsRepository variable
    // inside CreateAppointmentService class, neat shit.
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) { }

  public async execute({ provider_id, user_id, date }: IRequest): Promise<Appointment> {

    const appointmentDate = startOfHour(date); // regra de negocio
    const isBooked = await this.appointmentsRepository.findByDate(appointmentDate);

    const currentDate = new Date(Date.now());
    const appointmentRequestedDate = (date);



    if(isBefore(appointmentRequestedDate, currentDate)){
      throw new AppError('Appointment Date/Time not valid.');
    }


    if (isBooked) {
      // if (isEqual(appointmentDate, date){
      throw new AppError('Appointment already booked.');
    }

    const appointment = await this.appointmentsRepository.create({

      provider_id: provider_id,
      user_id: user_id,
      date: appointmentDate
    });

    return appointment;
  }
}

export default CreateAppointmentService;
