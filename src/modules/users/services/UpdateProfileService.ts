import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppErrors';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';


// services awayls have only one method, and are
// responsible for only one thing (unica responsabilidade)
// services don't have access to request, response
// services holds the (business rules) from the application

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) { }

  public async execute({ user_id, name, email, password, old_password }: IRequest): Promise<User | undefined> {
    // check if the user exists
    const user = await this.usersRepository.findByID(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    // user email should be unique
    if(user.email !== email){
      const userNewEmail = await this.usersRepository.findByEmail(email);
      if(userNewEmail){
        throw new AppError('Email already registrered');
      }

      user.email = email;
    }

    user.name = name;

    // change password
    if(password && old_password){

      const areEqual = await this.hashProvider.compareHash(password,old_password);

      if(areEqual){
        throw new AppError('New password should be different from the older one');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);

  }
}

export default UpdateProfileService;

