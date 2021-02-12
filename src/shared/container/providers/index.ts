import IStorageProver from './StorageProviders/models/IStorageProver';
import DiskStorageProvider from './StorageProviders/implementations/DiskStorageProvider';
import { container } from 'tsyringe';
import IStorageProvider from './StorageProviders/models/IStorageProver';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

container.registerSingleton<IStorageProvider>(
  'StorageProvider', DiskStorageProvider
);

// container.registerSingleton<IMailProvider>(
//   'MailProvider', MailProvider
// );
