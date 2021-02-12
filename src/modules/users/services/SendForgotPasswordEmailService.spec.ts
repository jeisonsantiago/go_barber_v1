import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppErrors';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmailService =
      new SendForgotPasswordEmailService(
        fakeUsersRepository,
        fakeMailProvider,
        fakeUserTokensRepository,
      );
  });

  it('Should be able to recover password through email',
    async () => {
      const sendEmailResponse = jest.spyOn(fakeMailProvider, 'sendMail');

      const user = await fakeUsersRepository.create({
        name: 'Jeison',
        email: 'jeison.santiago@gmail.com',
        password: 'casadocaraleo'
      });

      await sendForgotPasswordEmailService.execute({
        email: 'jeison.santiago@gmail.com',

      });

      expect(sendEmailResponse).toHaveBeenCalled();
    }
  );

  it('Should not be able to recover password with a unregistred email',
    async () => {

      await expect(
        sendForgotPasswordEmailService.execute({
          email: 'santiago@gmail.com',
        })
      ).rejects.toBeInstanceOf(AppError);
    }
  );

  it('Should generate forgot password token',
    async () => {

      const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

      const user = await fakeUsersRepository.create({
        name: 'Jeison',
        email: 'jeison.santiago@gmail.com',
        password: 'casadocaraleo'
      });

      await sendForgotPasswordEmailService.execute({
        email: 'jeison.santiago@gmail.com',
      });

      expect(generateToken).toHaveBeenCalledWith(user.id)
    }
  );

});

// RED / GREEN / REFACTOR
