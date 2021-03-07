import 'reflect-metadata';

import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import ListProfileService from './ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let listProfileService: ListProfileService;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
    listProfileService = new ListProfileService(fakeUsersRepository, fakeCacheProvider);
  })

  it('Should be able to list providers', async () => {
    //check if a function was called with a specific parameter

    const logUser = await createUser.execute({
      name: 'Jeison',
      email: 'jeison.santiago@gmail.com',
      password: 'casadocaraleo'
    });

    const user1 = await createUser.execute({
      name: 'Joao 1',
      email: 'joao.santiago@gmail.com',
      password: 'casadocaraleo'
    });

    const user2 = await createUser.execute({
      name: 'Joao 2',
      email: 'joao2.santiago@gmail.com',
      password: 'casadocaraleo'
    });

    const user3 = await createUser.execute({
      name: 'Joao 3',
      email: 'joao3.santiago@gmail.com',
      password: 'casadocaraleo'
    });

    let providers;
    if (logUser) {
      providers = await listProfileService.execute({ user_id: logUser.id });
    }

    expect(providers).not.toContain(logUser);
    // or
    expect(providers).toEqual([user1, user2, user3]);

  });
});


