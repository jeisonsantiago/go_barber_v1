import { getMongoRepository, MongoRepository, Repository } from 'typeorm';
import INotificationsRepository from '../../../repositories/INotificationsRepository';
import Notification from '../schemas/Notification';
import ICreateNotificationDTO from '../../../dtos/ICreateNotificationDTO';

// SOLID
// Liskov Subistitution Principle:
// definicao de funcoes por interface

class NotificationsRepository implements
  INotificationsRepository{

    private ormRepository:MongoRepository<Notification>;

    constructor(){
      this.ormRepository = getMongoRepository(Notification,'mongo');
    }

    public async create({content,recipient_id}:ICreateNotificationDTO):Promise<Notification>{
      const notification = this.ormRepository.create({content,recipient_id});
      //this.save(user);
      await this.ormRepository.save(notification);
      return notification;
    }
}

export default NotificationsRepository;
