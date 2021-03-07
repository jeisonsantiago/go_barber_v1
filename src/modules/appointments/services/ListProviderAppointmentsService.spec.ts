import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppErrors';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from '../services/ListProviderDayAvailabilityService';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointmentsService = new ListProviderAppointmentsService(fakeAppointmentsRepository,fakeCacheProvider);
  });

  it('Should be able to list appointments from provider in a specific day', async () => {
    //check if a function was called with a specific parameter

    const provider_id = "provider1";
    const user_id = "user1"

    for (let scheduleTime = 8; scheduleTime < 18; scheduleTime++) {
      await fakeAppointmentsRepository.create({
        provider_id: provider_id,
        date: new Date(Date.UTC(2021, 3, 1, scheduleTime, 0)),
        user_id:user_id,
      });
    }

    await fakeAppointmentsRepository.create({
      provider_id: 'provider2',
      date: new Date(Date.UTC(2021, 3, 1, 17, 0)),
      user_id:user_id,
    });

    const appointments = await listProviderAppointmentsService.execute({
      provider_id: provider_id,
      year: 2021,
      month: 3,
      day: 1,
    });


    // const datetest = new Date(2021, 3, 1, 14, 0);
    // console.log(datetest.getTimezoneOffset());

    expect(appointments[0].provider_id).toEqual('provider1');

  });
});


