import { Redis } from 'ioredis';

let redis: Redis | null = null;

function createInstance () {
  if (redis === null) {
    redis = new Redis({
      host: process.env.REDIS_HOST,
      port: 17946,
      password: process.env.REDIS_PASSWORD,
      username: process.env.REDIS_USER,
    });
  }
  return redis;
}

const redisClient = createInstance();

export default redisClient;
