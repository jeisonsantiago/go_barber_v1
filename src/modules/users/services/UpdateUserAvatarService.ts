import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppErrors';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';

import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProver';
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
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) { }

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {

    const user = await this.usersRepository.findByID(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.image_avatar) {
      // delete former avatar
      await this.storageProvider.deleteFile(user.image_avatar);
    }

    // change contents directly in the instance
    // then you can save to DB right after:
    const fileName = await this.storageProvider.saveFile(user.image_avatar);
    user.image_avatar = avatarFilename;

    return user;
  }
}

export default UpdateUserAvatarService;
