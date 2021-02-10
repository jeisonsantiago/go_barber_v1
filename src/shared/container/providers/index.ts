import IStorageProver from './StorageProviders/models/IStorageProver';
import DiskStorageProvider from './StorageProviders/implementations/DiskStorageProvider';
import {container} from 'tsyringe';
import IStorageProvider from './StorageProviders/models/IStorageProver';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',DiskStorageProvider
  );
