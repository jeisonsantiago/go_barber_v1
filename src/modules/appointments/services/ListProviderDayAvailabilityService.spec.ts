import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppErrors';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from '../services/ListProviderDayAvailabilityService';

let fakeUsersRepository: FakeUsersRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailabilityService', () => {

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(fakeAppointmentsRepository);
  });

  it('Should be able to list day availability from provider', async () => {
    //check if a function was called with a specific parameter

    for (let scheduleTime = 8; scheduleTime < 12; scheduleTime++) {
      await fakeAppointmentsRepository.create({
        provider_id: "user1",
        date: new Date(2021, 3, 1, scheduleTime, 10),
        user_id:"juca",
      });
    }

    await fakeAppointmentsRepository.create({
      provider_id: "user1",
      date: new Date(2021, 3, 2, 13, 10),
      user_id:"juca",
    });

    await fakeAppointmentsRepository.create({
      provider_id: "user1",
      date: new Date(2021, 3, 15, 13, 10),
      user_id:"juca",
    });

    // await fakeAppointmentsRepository.create({
    //   provider_id: "user1",
    //   date: new Date(2021, 2, 2, 12, 10),
    // });

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: "user1",
      year: 2021,
      month: 3,
      day: 1,
    });


    // console.log(availability);
    expect(availability).toEqual(expect.arrayContaining(
      [
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false }
      ]
    ));


  });
});


