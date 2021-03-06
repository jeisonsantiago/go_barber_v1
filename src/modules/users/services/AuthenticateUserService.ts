import User from '../infra/typeorm/entities/User';
import { compare } from 'bcryptjs';
import { sign, verify, Secret } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppErrors';

import IUsersRepository from '../repositories/IUsersRepository';

import { inject, injectable } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({ email, password }: IRequest): Promise<IResponse> {

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination uc.', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination ps', 401);
    }


    const { secret, expiresIn } = authConfig.jwt;
    console.log('ex:', expiresIn);

    // user experience WEB desktop
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: expiresIn,
    }); // only use user name or id;

    // user authenticated
    return {
      user,
      token,
    }

  }
}

export default AuthenticateUserService;
