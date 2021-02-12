import 'reflect-metadata';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppErrors';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'

describe('AuthenticateUser', () => {

  it('Should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository,fakeHashProvider);
    const authenticateUser = new AuthenticateUserService(fakeUsersRepository,fakeHashProvider);

    const user = await createUser.execute({
      name: 'Jeison',
      email: 'jeison.santiago@gmail.com',
      password: 'casadocaraleo'
    });

    const response = await authenticateUser.execute({
      email: 'jeison.santiago@gmail.com',
      password: 'casadocaraleo'
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('Should not be able to authenticate if the username is wrong', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository,fakeHashProvider);

    const authenticateUser = new AuthenticateUserService(fakeUsersRepository,fakeHashProvider);

    await createUser.execute({
      name: 'Jeison',
      email: 'jeison.santiago@gmail.com',
      password: 'casadocaraleo',
    });

    await expect(authenticateUser.execute({
      email: 'thomas.chupapau@gmail.com',
      password: 'casadocaraleo',
    })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate if the password is wrong', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository,fakeHashProvider);

    const authenticateUser = new AuthenticateUserService(fakeUsersRepository,fakeHashProvider);

    await createUser.execute({
      name: 'Jeison',
      email: 'jeison.santiago@gmail.com',
      password: 'casadocaraleo'
    });

    await expect(authenticateUser.execute({
        email: 'jeison.santiago@gmail.com',
        password: 'lolo',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
