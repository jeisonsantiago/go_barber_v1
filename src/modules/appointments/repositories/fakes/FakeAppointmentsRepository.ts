import { uuid } from 'uuidv4';
import { isEqual, getMonth, getDate, getYear } from 'date-fns';
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

  private appointments: Appointment[] = [];

  public async findDayAvailabilityFromProvider({ provider_id, year, month, day }: IFindDayAvailabilityFromProviderDTO): Promise<Appointment[]> {
    const findDayAppointment = this.appointments.filter(appointment => {
      return(
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) === month &&
        getYear(appointment.date) === year &&
        getDate(appointment.date) === day
      );
    });

    // console.log(findDayAppointment);
    return findDayAppointment;
  }

  public async findAllInMonthFromProvider({ provider_id, year, month }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {

    const findAppointment = this.appointments.filter(appointment => {
      return(
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) === month &&
        getYear(appointment.date) === year
      );
    });

    return findAppointment;
  }
  // return of a async functions will awayls be a Promise
  public async findByDate(date: Date): Promise<Appointment | undefined> {

    const findAppointment = this.appointments.find(appointment => isEqual(appointment.date, date));
    return findAppointment || undefined;
  }

  public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {

    const appointment = new Appointment();

    // same as below
    //Object.assign(appointment, {id:uuid(),date,provider_id});

    appointment.id = uuid();
    appointment.date = date;
    appointment.provider_id = provider_id;
    appointment.user_id = user_id;

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
