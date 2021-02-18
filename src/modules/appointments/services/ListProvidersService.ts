import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppErrors';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import { injectable,inject } from 'tsyringe';

interface IRequest {
  user_id:string;
}

@injectable()
class ListProfileService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    ) { }

  public async execute(  {user_id} : IRequest): Promise<User[] | undefined> {

    const user = await this.usersRepository.findAllProviders(
      {
        except_user_id:user_id,
      }
    );

    return user;
  }
}

export default ListProfileService;
