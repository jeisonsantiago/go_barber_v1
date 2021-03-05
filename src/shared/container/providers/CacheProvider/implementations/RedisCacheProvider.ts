import ICashProvider from '../models/ICashProvider';
import Redis, { Redis as RedisClient } from 'ioredis';

import cacheConfig from '@config/cache';

export default class RedisCacheProvider implements ICashProvider {

  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if(!data) return null;

    const parsedData = JSON.parse(data) as T; // parse as T
    return parsedData;
  }

  public async invalidade(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidadePrefix(prefix:string):Promise<void>{
    const keys = await this.client.keys(`${prefix}:*`);

    if(!keys) return;

    const pipeline = this.client.pipeline();

    keys.forEach(key=>{
      pipeline.del(key);
    })

    await pipeline.exec();
  }
}
