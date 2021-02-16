import 'reflect-metadata';

import UpdateUserAvatarService from './UpdateUserAvatarService';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppErrors';

let fakeUsersRepository:FakeUsersRepository;
let fakeHashProvider:FakeHashProvider;
let createUser:CreateUserService;
let fakeStorageProvider:FakeStorageProvider;
let updateAvatarService:UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {

  beforeEach(()=>{
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    fakeStorageProvider = new FakeStorageProvider();
    updateAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  })

  it('Should be able to update avatar file', async () => {
    //check if a function was called with a specific parameter
    const deleteFile = jest.spyOn(fakeStorageProvider,'deleteFile');

    const user = await createUser.execute({
      name: 'Jeison',
      email: 'jeison.santiago@gmail.com',
      password: 'casadocaraleo'
    });

    const imageURL = 'buceta.jpeg';

    if (user) {

      // emulates if it has already a file
      user.image_avatar = imageURL;

      const updateFile = await updateAvatarService.execute({
        user_id: user.id,
        avatarFilename: imageURL,
      });

      expect(deleteFile).toBeCalledWith('buceta.jpeg');
      expect(updateFile.image_avatar).toEqual(imageURL);
    }
  });


  it('Should not be able to update avatar file if not authenticated', async () => {

    const user = await createUser.execute({
      name: 'Jeison',
      email: 'jeison.santiago@gmail.com',
      password: 'casadocaraleo'
    });

    const imageURL = 'buceta.jpeg';

    expect(
      updateAvatarService.execute({
        user_id: '11',
        avatarFilename: imageURL,
      })
    ).rejects.toBeInstanceOf(AppError);

  });


});
