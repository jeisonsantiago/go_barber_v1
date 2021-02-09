import { container } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/ApointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';


import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository', AppointmentsRepository
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository', UsersRepository
);

container.registerSingleton<IHashProvider>(
  'UsersRepository', BCryptHashProvider
);
