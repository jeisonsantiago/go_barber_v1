import { uuid } from 'uuidv4';
import { isEqual, getMonth, getDate, getYear } from 'date-fns';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

// SOLID

// Liskov Subistitution Principle:
// definicao de funcoes por interface

class FakeNotificationsRepository implements
  INotificationsRepository {

  private notifications: Notification[] = [];

  public async create({ recipient_id, content }: ICreateNotificationDTO): Promise<Notification> {

    const notification = new Notification();

    notification.recipient_id = recipient_id;
    notification.content = content;

    notification.created_at = new Date();
    notification.updated_at = new Date();

    // notification.id = uuid();
    notification.read = false;

    this.notifications.push(notification);

    return notification;
  }
}

export default FakeNotificationsRepository;
