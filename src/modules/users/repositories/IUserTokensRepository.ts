import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

export default interface IUsersRepository {
  // find by ID
  generate(user_id:string):Promise<UserToken>;
  findByToken(token:string):Promise<UserToken | undefined>;
}
