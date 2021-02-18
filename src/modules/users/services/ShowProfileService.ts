import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppErrors';
import IUsersRepository from '../repositories/IUsersRepository';

import { injectable,inject } from 'tsyringe';

interface IRequest {
  user_id:string;
}

@injectable()
class ShowProfileService {


  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    ) { }

  public async execute({ user_id }: IRequest): Promise<User | undefined> {

    const user = await this.usersRepository.findByID(user_id);

    if(!user){
      throw new AppError('User not found');
    }

    return user;
  }
}

export default ShowProfileService;
