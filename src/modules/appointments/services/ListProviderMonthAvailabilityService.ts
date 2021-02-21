import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppErrors';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import { injectable, inject } from 'tsyringe';

import { getDaysInMonth, getDate } from 'date-fns';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

// return
// [{day:1, available: false}]

type IResponse = Array<{
  day: number;
  available: boolean;
}>

@injectable()
class ListProviderMonthAvailabilityService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { }

  public async execute({ provider_id, year, month }: IRequest): Promise<IResponse> {

    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
      provider_id: provider_id,
      month: month,
      year: year
    });

    const numberOfDaysInMonth = getDaysInMonth(
      new Date(year, month)
    );

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day=>{
      const appointmentsInDay = appointments?.filter(apointment=>{
        return getDate(apointment.date) === day;
      });

      return{
        day: day,
        available: appointmentsInDay.length < 10,
      }
    });


    // return [{day:1,available:false}];
    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
