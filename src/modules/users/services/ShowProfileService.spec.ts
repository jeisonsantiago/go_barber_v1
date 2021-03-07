import 'reflect-metadata';

import CreateUserService from './CreateUserService';
import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import AppError from '@shared/errors/AppErrors';
import User from '../infra/typeorm/entities/User';
import ShowProfileService from '../services/ShowProfileService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let showProfileService: ShowProfileService;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('UpdateProfile', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
    showProfileService = new ShowProfileService(fakeUsersRepository);
  })

  it('Should be able to show user info', async () => {
    //check if a function was called with a specific parameter
    const user = await createUser.execute({
      name: 'Jeison',
      email: 'jeison.santiago@gmail.com',
      password: 'casadocaraleo'
    });

    if (user) {
      expect(await showProfileService.execute({ user_id: user.id })).toBeInstanceOf(User);
    }

  });

  it('Should not be able to show unregistred users ', async () => {

    await expect(showProfileService.execute({
      user_id: 'casa',
    }
    )).rejects.toBeInstanceOf(AppError);

  });

});


