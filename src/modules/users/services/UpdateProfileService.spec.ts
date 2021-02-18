import 'reflect-metadata';

import CreateUserService from './CreateUserService';
import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import AppError from '@shared/errors/AppErrors';
import UpdateProfileService from './UpdateProfileService';

import BCryptHashProvider from '../providers/HashProvider/implementations/BCryptHashProvider';
import { is } from 'date-fns/locale';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let createUser: CreateUserService;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    // fakeHashProvider = new FakeHashProvider();
    fakeHashProvider = new BCryptHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  })

  it('Should be able to update name', async () => {
    //check if a function was called with a specific parameter
    const user = await createUser.execute({
      name: 'Jeison',
      email: 'jeison.santiago@gmail.com',
      password: 'casadocaraleo'
    });

    const newName = 'Jeison Santiago';

    if (user) {
      const updatedUser = await updateProfileService.execute({
        user_id: user.id,
        email: user.email,
        name: newName,
      });

      expect(updatedUser?.name).toEqual(newName);
    }

  });

  it('Only update exising user', async () => {
    expect(
      updateProfileService.execute({
        user_id: "123",
        email: "jeison.santiago@gmail.com",
        name: "Joao"
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update email if the new one is already registered', async () => {
    //check if a function was called with a specific parameter
    const user = await createUser.execute({
      name: 'Jeison',
      email: 'jeison.santiago@gmail.com',
      password: 'casadocaraleo'
    });

    const user2 = await createUser.execute({
      name: 'Jonas',
      email: 'jonas.santiago@gmail.com',
      password: 'casadocu'
    });

    //const newName = 'Jeison Santiago';
    //const newEmail = 'jeison.santiago@gmail.com';
    const newEmail = 'jeison.santiago@gmail.com';

    if (user2) {
      // const updatedUser = await updateProfileService.execute({
      //   user_id: user2?.id,
      //   email: newEmail,
      //   name: 'jonas',
      // });

      expect(updateProfileService.execute({
        user_id: user2?.id,
        email: newEmail,
        name: 'jonas'
      })).rejects.toBeInstanceOf(AppError);
      // expect(user2?.email).toEqual(newEmail);
    }

  });

  it('Should able to update email', async () => {
    const user = await createUser.execute({
      name: 'Jeison',
      email: 'jeison.santiago@gmail.com',
      password: 'casadocaraleo'
    });

    const newEmail = 'jeison@gmail.com';

    if (user) {
      const updatedUser = await updateProfileService.execute({
        user_id: user.id,
        email: newEmail,
        name: user.name,
      });
      //const updatedUser = await fakeUsersRepository.findByID(newUser?.id);

      if (updatedUser) {
        expect(updatedUser.email).toEqual(newEmail);
      }
    }

  });

  it('Should not able to change password if the old password is equal to new', async () => {

    const user = await createUser.execute({
      name: 'Jeison',
      email: 'jeison.santiago@gmail.com',
      password: 'casadocaraleo',
    });

    const newPassowrd = 'casadocaraleo';

    if (user) {
      await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: user.name,
        email: user.email,
        old_password: user.password,
        password: newPassowrd,
      })).rejects.toBeInstanceOf(AppError);
    }

    // const updatedUser = await fakeUsersRepository.findByEmail('jeison.santiago@gmail.com');

    // if(updatedUser){
    //   const compareHash =  await fakeHashProvider.compareHash(newPassowrd,updatedUser.password);
    //   expect(compareHash).toBeFalsy();
    // }
  });

  it('Should be able to update password', async () => {

    const user = await createUser.execute({
      name: 'Jeison',
      email: 'jeison.santiago@gmail.com',
      password: 'casadocaraleo',
    });

    const newPassowrd = 'casadocaraleo2';

    if (user) {
      const updateUser = await updateProfileService.execute({
        user_id: user.id,
        name: user.name,
        email: user.email,
        old_password: user.password,
        password: newPassowrd,
      });

      if(updateUser){
        expect(await fakeHashProvider.compareHash(newPassowrd,updateUser.password)).toBeTruthy();
      }
    }
  });
});
