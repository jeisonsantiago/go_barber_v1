import { container } from 'tsyringe';


import '@modules/users/providers/';
import './providers';

import './providers/CacheProvider';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/ApointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';


import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UsersTokensRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';


container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository', AppointmentsRepository
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository', UsersRepository
);

container.registerSingleton<IHashProvider>(
  'HashProvider', BCryptHashProvider
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository', UserTokensRepository
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository', NotificationsRepository
);

