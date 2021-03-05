import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { startOfHour, isBefore, getHours, format } from 'date-fns';
import AppError from '@shared/errors/AppErrors';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import { injectable, inject } from 'tsyringe';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICashProvider';

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
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }



  public async execute({ provider_id, user_id, date }: IRequest): Promise<Appointment> {

    const appointmentDate = startOfHour(date); // regra de negocio
    const isBooked = await this.appointmentsRepository.findByDate(appointmentDate);

    const currentDate = new Date(Date.now());
    const appointmentRequestedDate = (date);

    // check user ID (provider and user can't be the same)
    if (provider_id === user_id) {
      throw new AppError(`Can't make an appointment with yourself.`);
    }

    // check date, appointment shouldn't be in the past.
    if (isBefore(appointmentRequestedDate, currentDate)) {
      throw new AppError('Appointment Date/Time not valid.');
    }

    //appointments should be scheduled between 8am to 17pm
    const hour = getHours(date);
    if (hour < 8 || hour > 17) {
      throw new AppError('Appointments should be scheduled between 8am to 17pm.');
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

    const dateFormated = format(appointment.date, "dd/MM/yyyy 'as' HH:mm");
    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para a data ${dateFormated}`,
    });

    await this.cacheProvider.invalidade(
      `provider-appointments:${provider_id}:${format(appointment.date, 'yyyy-M-dd')}
      `);

    return appointment;
  }
}

export default CreateAppointmentService;
