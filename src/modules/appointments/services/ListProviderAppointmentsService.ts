import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppErrors';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import Appointment from '../infra/typeorm/entities/Appointment';
import { injectable, inject } from 'tsyringe';

import { getDaysInMonth, getDate } from 'date-fns';

interface IRequest {
  provider_id: string;
  day:number;
  month: number;
  year: number;
}

// return
// [{day:1, available: false}]


@injectable()
class ListProviderAppointmentsService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { }

  public async execute({ provider_id, year, month, day }: IRequest): Promise<Appointment[]> {

    const appointments = await this.appointmentsRepository.findDayAvailabilityFromProvider({
      provider_id,
      year,
      month,
      day
    });

    return appointments;
  }
}

export default ListProviderAppointmentsService;
