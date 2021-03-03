import { container } from 'tsyringe';

import DiskStorageProvider from './StorageProviders/implementations/DiskStorageProvider';
import S3StorageProvider from './StorageProviders/implementations/S3StorageProvider';
import IStorageProvider from './StorageProviders/models/IStorageProver';


import mail from '@config/mail';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import SESMailProvider from '@shared/container/providers/MailProvider/implementations/SESMailProvider';


import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

import uploadConfig from '@config/upload';

const providers = {
  disk:DiskStorageProvider,
  s3:S3StorageProvider,
}

container.registerSingleton<IStorageProvider>(
  'StorageProvider', providers[uploadConfig.driver]
);

// container.registerSingleton<IMailProvider>(
//   'MailProvider', EtherealMailProvider,
// );
container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider', HandlebarsMailTemplateProvider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  mail.driver === "ethereal" ?
    container.resolve(EtherealMailProvider)
    :
    container.resolve(SESMailProvider)
);


