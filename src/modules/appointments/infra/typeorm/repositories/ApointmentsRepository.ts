import { getRepository, Repository, Raw } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindDayAvailabilityFromProviderDTO from '@modules/appointments/dtos/IFindDayAvailabilityFromProviderDTO';

// SOLID

// Liskov Subistitution Principle:
// definicao de funcoes por interface

class AppointmentsRepository implements
  IAppointmentsRepository {

  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findDayAvailabilityFromProvider({ provider_id, year, month, day }: IFindDayAvailabilityFromProviderDTO): Promise<Appointment[]> {
    // TODO: fix this, should work with day only
    const parsedMonth = String(month).padStart(2, '0');
    const parsedHour = String(day).padStart(2, '0');

    const findAppointments = await this.ormRepository.find({
      where: {
        provider: provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName},'MM-YYY-DD') = '${parsedMonth}-${year}-${day}'`
        ),
      },
    });

    return findAppointments;
  }


  public async findAllInMonthFromProvider({ provider_id, year, month }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {

    const parsedMonth = String(month).padStart(2, '0');

    const findAppointments = await this.ormRepository.find({
      where: {
        provider: provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName},'MM-YYY') = '${parsedMonth}-${year}'`
        ),
      },
    });

    return findAppointments;
  }

  // return of a async functions will awayls be a Promise
  public async findByDate(date: Date): Promise<Appointment | undefined> {

    const findAppointment = await this.ormRepository.findOne({
      where: { date: date },
    })

    return findAppointment || undefined;
  }

  public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, user_id, date });
    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default AppointmentsRepository;
