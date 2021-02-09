import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

// SOLID

// Liskov Subistitution Principle:
// definicao de funcoes por interface

class FakeUsersRepository implements
  IUsersRepository {

  private users: User[] = [];

  // return of a async functions will awayls be a Promise
  public async findByID(id: string): Promise<User | undefined> {

    const findUser = this.users.find(user => user.id === id);
    return findUser || undefined;
  }

  public async findByEmail(e: string): Promise<User | undefined> {

    const findUser = this.users.find(user => user.email === e);
    return findUser;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {

    const user = new User();

    // same as below
    Object.assign(user, {id:uuid()},userData);

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {

    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
