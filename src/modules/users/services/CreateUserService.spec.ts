import 'reflect-metadata';

import CreateUserService from './CreateUserService';
import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppErrors';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
  it('Should be able to create a new user', () => {
    async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeHashProvider = new FakeHashProvider();

      const createUser = new CreateUserService(fakeUsersRepository,fakeHashProvider);
      const user = await createUser.execute({
        name: 'Jeison',
        email: 'jeison.santiago@gmail.com',
        password: 'casadocaraleo'
      });

      expect(user).toHaveProperty('id');
    }
  });

  it('Should not be able to create a new user with the same email',
    async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeHashProvider = new FakeHashProvider();

      const createUser = new CreateUserService(fakeUsersRepository,fakeHashProvider);

      const sameEmail = 'jeison.santiago@gmail.com';

      await createUser.execute({
        name: 'Jeison',
        email: sameEmail,
        password: 'casadocaraleo',
      });

      await expect(
        createUser.execute({
          name: 'Joap',
          email: sameEmail,
          password: 'casadocaraleo',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
});
