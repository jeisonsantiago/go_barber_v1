import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';


import AppError from '@shared/errors/AppErrors';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists');
    }

    const user = await this.usersRepository.findByID(userToken?.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    // const tokenCreatedAt = new Date(userToken.created_at.toUTCString());
    // const timeNow = new Date(new Date().toUTCString());

    const tokenCreatedAt = userToken.created_at;
    const timeNow = Date.now();

    const hoursDiff = Math.abs( differenceInHours(timeNow, tokenCreatedAt));

    if (hoursDiff > 2) {
      throw new AppError('Token expired.');
    }

    // has to be crypto
    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
