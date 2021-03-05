import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppErrors';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import Appointment from '../infra/typeorm/entities/Appointment';

import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICashProvider';

interface IRequest {
  provider_id: string;
  day: number;
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

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  public async execute({ provider_id, year, month, day }: IRequest): Promise<Appointment[]> {

    const cacheKey = `provider-appointments:${provider_id}-${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKey);
    appointments = null;

    if (!appointments) {
      appointments = await this.appointmentsRepository.findDayAvailabilityFromProvider({
        provider_id,
        year,
        month,
        day
      });
    }

    console.log('foi no banco!');

    await this.cacheProvider.save(
      cacheKey,
      JSON.stringify(appointments)
    );

    return appointments;
  }
}

export default ListProviderAppointmentsService;
