import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

export default interface IUsersRepository {
  // find by ID
  findByID(id: string): Promise<User | undefined>;

  // find by email
  findByEmail(email: string): Promise<User | undefined>;

  // create and save
  create(data: ICreateUserDTO): Promise<User | undefined>;
  //save(user: User): Promise<User | undefined>;
}
