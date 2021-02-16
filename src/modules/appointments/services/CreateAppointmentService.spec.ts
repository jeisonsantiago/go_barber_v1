import 'reflect-metadata';

import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppErrors';


let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository
    );
  });

  it('Should be able to create a new appointment',
    async () => {

      const appointment = await createAppointment.execute({
        date: new Date(),
        provider_id: '1234'
      });

      expect(appointment).toHaveProperty('id');
      expect(appointment.provider_id).toBe('1234');
    });
  //------------------------------------------------------------------------------

  it('Should not be able to create two appointments at the same date/time',
    async () => {

      const dateSame = new Date(2020, 4, 10, 11);

      const appointment1 = await createAppointment.execute({
        date: dateSame,
        provider_id: '1234'
      });

      expect(
        createAppointment.execute({
          date: dateSame,
          provider_id: '1234'
        })).rejects.toBeInstanceOf(AppError);
    });
});
