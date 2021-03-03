import 'reflect-metadata';
import { addMinutes, subMinutes } from 'date-fns';

import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppErrors';
import FakeNotificationsRepository from '@modules/notifications/infra/typeorm/repositories/fake/FakeNotificationsRepository';


let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;

const dateToWork = new Date(2021,4,10,8);

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });

  it('Should be able to create a new appointment',
    async () => {

      const appointment = await createAppointment.execute({
        date: dateToWork,
        provider_id: '1234',
        user_id: 'joao',
      });

      expect(appointment).toHaveProperty('id');
      expect(appointment.provider_id).toBe('1234');
    });
  //------------------------------------------------------------------------------

  it('Should not be able to create two appointments at the same date/time',
    async () => {

      const dateSame = new Date(2021, 4, 10, 12);

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
          date: subMinutes(new Date(), 5),
          provider_id: '1234',
          user_id: 'joao',
        })
      ).rejects.toBeInstanceOf(AppError);
    });

  it('Should not be able to create an appointment which user having the same ID as the provider',
    async () => {

      await expect(
        createAppointment.execute({
          date: addMinutes(dateToWork, 10),
          provider_id: '1234',
          user_id: '1234',
        })
      ).rejects.toBeInstanceOf(AppError);
    });

  it('Should not be able to create an appointment before 8am and after 17pm',
    async () => {

      await expect(
        createAppointment.execute({
          date: new Date(2021,5,1,5,0,0),
          provider_id: '1234',
          user_id: '123',
        })
      ).rejects.toBeInstanceOf(AppError);

      // await expect(
      //   createAppointment.execute({
      //     date: new Date(2021,5,1,18,0,0),
      //     provider_id: '1234',
      //     user_id: '123',
      //   })
      // ).rejects.toBeInstanceOf(AppError);

    });
});
