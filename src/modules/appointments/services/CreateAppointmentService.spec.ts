import 'reflect-metadata';
import {addMinutes,subMinutes} from 'date-fns';

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
        date: addMinutes(new Date(),1),
        provider_id: '1234',
        user_id: 'joao',
      });

      expect(appointment).toHaveProperty('id');
      expect(appointment.provider_id).toBe('1234');
    });
  //------------------------------------------------------------------------------

  it('Should not be able to create two appointments at the same date/time',
    async () => {

      const dateSame = new Date(2021, 4, 10, 11);

      const appointment1 = await createAppointment.execute({
        date: dateSame,
        provider_id: '1234',
        user_id: 'joao',
      });

      expect(
        createAppointment.execute({
          date: dateSame,
          provider_id: '1234',
          user_id: 'joao',
        })).rejects.toBeInstanceOf(AppError);
    });

  it('Should not be able to create a new appointment on a passed date',
    async () => {

      await expect(
        createAppointment.execute({
          date: subMinutes(new Date(),1),
          provider_id: '1234',
          user_id: 'joao',
        })
      ).rejects.toBeInstanceOf(AppError);
    });
});
