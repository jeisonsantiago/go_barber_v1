import { getRepository, Repository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import UserToken from '../entities/UserToken';
// SOLID

// Liskov Subistitution Principle:
// definicao de funcoes por interface

class UsersTokensRepository implements
  IUserTokensRepository {

  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async findByToken(token:string):Promise<UserToken | undefined>{
    const user = await this.ormRepository.findOne({
      where:{token},
    });

    return user;
  }

  public async generate(user_id:string):Promise<UserToken>{
    const userToken = this.ormRepository.create({user_id});

    // time zone issues to solve
    userToken.created_at = new Date();
    userToken.updated_at = new Date();

    await this.ormRepository.save(userToken);

    return userToken;
  }
}

export default UsersTokensRepository;

