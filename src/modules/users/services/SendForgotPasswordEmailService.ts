import path from 'path';

import User from '@modules/users/infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import AppError from '@shared/errors/AppErrors';
import IUsersRepository from '../repositories/IUsersRepository';

import { injectable, inject } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import IUserTokensRepository from '../repositories/IUserTokensRepository';

import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';

// services awayls have only one method, and are
// responsible for only one thing (unica responsabilidade)
// services don't have access to request, response
// services holds the (business rules) from the application

/**
 * DEPENDENCY INVERSION (SOLID)
 */

/**
* Business rules:
* no replicated email or name
* cript pasword
*/

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) { }

  public async execute({ email }: IRequest): Promise<void> {

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email not registred.');
    }

    const {token} = await this.userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(__dirname,'..','views','forgot_password.hbs');

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: "[GoBarber] Recuperacao de Senha",
      templateData:{
        file: forgotPasswordTemplate,
        variables:{
          name:user.name,
          //token:token,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`
        },
      }
    });


  }
}

export default SendForgotPasswordEmailService;
