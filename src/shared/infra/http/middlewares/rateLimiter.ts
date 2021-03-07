import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'redis';

import AppError from 'shared/errors/AppErrors';
// record on Redis

const redisClient = Redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const rateLimit = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 5,//how many requisitions 1/s per IP = 5 requests in 1 second
  duration: 1,
})

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction): Promise<void> {
  try {
    await rateLimit.consume(request.ip);
    return next();
  } catch (error) {
    throw new AppError('Too many requests', 429);
  }
}
