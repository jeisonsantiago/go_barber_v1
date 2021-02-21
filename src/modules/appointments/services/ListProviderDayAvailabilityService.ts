import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppErrors';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindDayAvailabilityFromProviderDTO from '@modules/appointments/dtos/IFindDayAvailabilityFromProviderDTO';

import { injectable, inject } from 'tsyringe';

import { getDaysInMonth, getHours, isAfter } from 'date-fns';

interface IRequest {
  provider_id: string;
  year: number;
  month: number;
  day: number;
}

/**
 return
 [{hour:1, avaiable:false}]
 */

type IResponse = Array<{
  hour: number;
  available: boolean;
}>

@injectable()
class ListProviderDayAvailabilityService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { }

  public async execute({ provider_id, year, month, day }: IRequest): Promise<IResponse> {

    const appointments = await this.appointmentsRepository.findDayAvailabilityFromProvider({
      provider_id: provider_id,
      month: month,
      year: year,
      day: day,
    });

    const startHour = 8;
    const hourRange = Array.apply(0, Array(10)).map((_, index) => index + startHour);

    const hoursUnavailable = appointments.map(appointments => {
      return getHours(appointments.date);
    });

    const availability = hourRange.map(hour => {

      const currentDate = new Date(Date.now());
      const compareDate = new Date(year, month, day, hour);

      return {
        hour: hour,
        available: !hoursUnavailable.includes(hour) && isAfter(compareDate,currentDate),
      }
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
