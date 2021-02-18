import 'reflect-metadata';

import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import AppError from '@shared/errors/AppErrors';
import User from '@modules/users/infra/typeorm/entities/User';
import ListProfileService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let listProfileService:ListProfileService;
let createUser: CreateUserService;

describe('ListProviders', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    listProfileService = new ListProfileService(fakeUsersRepository);
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


    if(logUser){
      const list = await listProfileService.execute({user_id:logUser.id});

      console.log("list",list);
    }

    // if(user){
      //expect(await showProfileService.execute({user_id:user.id})).toBeInstanceOf(User);
    // }

  });

  // it('Should not be able to show unregistred users ', async () => {

  //   await expect( showProfileService.execute({
  //     user_id:'casa',
  //   }
  //   )).rejects.toBeInstanceOf(AppError);

  // });

});


