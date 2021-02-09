import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
// SOLID

// Liskov Subistitution Principle:
// definicao de funcoes por interface

class AppointmentsRepository implements
  IAppointmentsRepository {

  private appointments: Appointment[] = [];

  // return of a async functions will awayls be a Promise
  public async findByDate(date: Date): Promise<Appointment | undefined> {

    const findAppointment = this.appointments.find(appointment => isEqual(appointment.date,date));
    return findAppointment || undefined;
  }

  public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment> {

    const appointment = new Appointment();

    // same as below
    //Object.assign(appointment, {id:uuid(),date,provider_id});

    appointment.id = uuid();
    appointment.date = date;
    appointment.provider_id = provider_id;

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
