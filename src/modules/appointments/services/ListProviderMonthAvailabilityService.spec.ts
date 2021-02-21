import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppErrors';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '../services/ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(fakeAppointmentsRepository);
  })

  it('Should be able to list month availability from provider', async () => {
    //check if a function was called with a specific parameter

    for (let scheduleTime = 1; scheduleTime < 11; scheduleTime++) {
      await fakeAppointmentsRepository.create({
        provider_id: "user1",
        date: new Date(2021, 1, 1, scheduleTime, 10),
        user_id:"joao"
      });
    }

    await fakeAppointmentsRepository.create({
      provider_id: "user1",
      date: new Date(2021, 1, 2, 13, 10),
      user_id:"joao"
    });

    await fakeAppointmentsRepository.create({
      provider_id: "user1",
      date: new Date(2021, 1, 15, 13, 10),
      user_id:"joao"
    });

    await fakeAppointmentsRepository.create({
      provider_id: "user1",
      date: new Date(2021, 2, 2, 12, 10),
      user_id:"joao"
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: "user1",
      year: 2021,
      month: 1,
    });

    // console.log(availability);
    expect(availability).toEqual(expect.arrayContaining(
      [
        { day: 1, available: false },
        { day: 2, available: true },
        { day: 3, available: true }
      ]
    ));


  });
});


