import User from '@modules/users/infra/typeorm/entities/User';
import { getRepository } from 'typeorm';
import path from 'path';
import uploadConfig from '@config/upload';
import fs from 'fs';
import AppError from '@shared/errors/AppErrors';
import {inject, injectable} from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
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
    private usersRepository: IUsersRepository
    ) { }

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {

    const user = await this.usersRepository.findByID(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.image_avatar) {
      // delete former avatar
      const userAvatarFilePath = path.join(uploadConfig.directory, user.image_avatar);

      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    // change contents directly in the instance
    // then you can save to DB right after:
    user.image_avatar = avatarFilename;
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
