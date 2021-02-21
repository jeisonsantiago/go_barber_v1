import { getRepository, Not, Repository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

// SOLID
// Liskov Subistitution Principle:
// definicao de funcoes por interface

class UsersRepository implements
  IUsersRepository{

    private ormRepository:Repository<User>;

    constructor(){
      this.ormRepository = getRepository(User);
    }

    public async findAllProviders({except_user_id}:IFindAllProvidersDTO):Promise<User[]>{

      let users;

      if(except_user_id){
        users = await this.ormRepository.find({
          where:{
            id:Not(except_user_id),
          }
        })
      }else{
        users = await this.ormRepository.find();
      }

      return users;
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
