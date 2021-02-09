import { getRepository, Repository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
// SOLID

// Liskov Subistitution Principle:
// definicao de funcoes por interface

class UsersRepository implements
  IUsersRepository{

    private ormRepository:Repository<User>;

    constructor(){
      this.ormRepository = getRepository(User);
    }

    // return of a async functions will awayls be a Promise
    public async findByID(id: string): Promise<User|undefined> {

        const findUser = await this.ormRepository.findOne({
            where:{id:id},
        })

        return findUser || undefined;
    }

    public async findByEmail(email: string): Promise<User|undefined> {

      const findUser = await this.ormRepository.findOne({
          where:{email:email},
      })

      return findUser || undefined;
  }

    public async create({name, email, password}:ICreateUserDTO):Promise<User>{
      const user = this.ormRepository.create({name,email,password});
      this.save(user);
      return user;
    }

    public async save(user:User):Promise<User>{
      await this.ormRepository.save(user);
      return user;
    }
}

export default UsersRepository;
