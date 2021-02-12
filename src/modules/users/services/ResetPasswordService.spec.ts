import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppErrors';
import FakeUserTokensRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';


let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService =
      new ResetPasswordService(
        fakeUsersRepository,
        fakeUserTokensRepository,
        fakeHashProvider,
      );
  });

  it('Should be able reset the password',
    async () => {
      const user = await fakeUsersRepository.create({
        name: 'Jeison Santiago',
        email: 'jeison.santiago@gmail.com',
        password: '1234',
      });

      const userToken = await fakeUserTokensRepository.generate(user.id);

      await resetPasswordService.execute({
        token: userToken.token,
        password: '123123',
      });

      const updatedUser = await fakeUsersRepository.findByID(user.id);

      expect(updatedUser?.password).toBe('123123');
    }
  );

  it('Should not be able reset the password with a non-existing-token',
    async () => {
      expect(resetPasswordService.execute({
        token: 'non-existing-token',
        password: '123123',
      })).rejects.toBeInstanceOf(AppError);
    }
  );

  it('Should not be able to hash password',
    async () => {
      const useHash = jest.spyOn(fakeHashProvider, 'generateHash');

      const user = await fakeUsersRepository.create({
        name: 'Jeison Santiago',
        email: 'jeison.santiago@gmail.com',
        password: '1234',
      });

      const userToken = await fakeUserTokensRepository.generate(user.id);

      await resetPasswordService.execute({
        token: userToken.token,
        password: '123123',
      });

      const updatedUser = await fakeUsersRepository.findByID(user.id);

      expect(useHash).toHaveBeenCalled();
    }
  );

  it('Should not be able reset the password with a non existing user',
    async () => {

      const { token } = await fakeUserTokensRepository.generate('non-existing-token');

      await expect(
        resetPasswordService.execute({
          token: token,
          password: '123456'
        })).rejects.toBeInstanceOf(AppError);
    }
  );

  it('Should not be able reset the password with a expired token (more than 2h)',
    async () => {
      const user = await fakeUsersRepository.create({
        name: 'Jeison Santiago',
        email: 'jeison.santiago@gmail.com',
        password: '1234',
      });

      const {token} = await fakeUserTokensRepository.generate(user.id);

      // once the Date is call, it will run the mockImplementation
      jest.spyOn(Date,'now').mockImplementationOnce(()=>{
        const customDate = new Date();
        return customDate.setHours(customDate.getHours()+3);
      });

      await expect(resetPasswordService.execute({
        token: token,
        password: '123123',
      })).rejects.toBeInstanceOf(AppError);
    });

});

// RED / GREEN / REFACTOR

// TODO: tests
// Hash #
// 2h expiring
// user not exists
// token not exists #

